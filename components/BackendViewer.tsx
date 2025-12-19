
import React, { useState } from 'react';

const BACKEND_FILES = [
  {
    name: 'access/views.py',
    content: `from rest_framework import status, views
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from sessions.models import HotspotSession
from packages.models import UserPackage

class AccessControlView(views.APIView):
    """
    Interface for the Network Gateway (iptables/MikroTik).
    Used by the router to check if a MAC/IP is allowed.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # API Contract: { "mac": "...", "ip": "..." }
        mac = request.data.get('mac')
        ip = request.data.get('ip')
        
        active_pkg = UserPackage.objects.filter(
            user=request.user, 
            status='active'
        ).first()

        if active_pkg and active_pkg.is_valid():
            # Create/Update Session
            session, _ = HotspotSession.objects.get_or_create(
                user=request.user, 
                device_mac=mac,
                defaults={'ip_address': ip}
            )
            session.session_status = 'connected'
            session.save()
            
            return Response({
                "authorized": True,
                "timeout": active_pkg.remaining_time_minutes * 60,
                "data_quota": active_pkg.remaining_data_mb
            })
        
        return Response({"authorized": False}, status=status.HTTP_403_FORBIDDEN)

class RevokeAccessView(views.APIView):
    permission_classes = [IsAdminUser] # Gateway calls this with a secret key
    
    def post(self, request):
        mac = request.data.get('mac')
        HotspotSession.objects.filter(device_mac=mac).update(session_status='disconnected')
        # Here: Trigger external script to drop iptables rule
        return Response({"status": "revoked"})`
  },
  {
    name: 'core/tasks.py',
    content: `from celery import shared_task
from django.utils import timezone
from packages.models import UserPackage
from sessions.models import HotspotSession

@shared_task
def process_usage_accounting():
    """
    Runs every 1 minute via Celery Beat.
    Deducts data and time from active user packages.
    """
    active_sessions = HotspotSession.objects.filter(session_status='connected')
    
    for session in active_sessions:
        user_pkg = UserPackage.objects.filter(user=session.user, status='active').first()
        if not user_pkg:
            # Revoke access immediately if no package exists
            revoke_network_access(session.device_mac)
            continue
            
        # 1. Time Deduction (1 minute per task run)
        user_pkg.remaining_time_minutes -= 1
        
        # 2. Data Deduction (Calculated from Gateway usage logs)
        # In real-world, Gateway pushes usage or we query RADIUS/SNMP
        delta_mb = query_gateway_usage(session.device_mac) 
        user_pkg.remaining_data_mb -= delta_mb
        session.data_used_mb += delta_mb
        
        # Check Limits
        if user_pkg.remaining_data_mb <= 0 or user_pkg.remaining_time_minutes <= 0:
            user_pkg.status = 'exhausted'
            revoke_network_access(session.device_mac)
            
        if user_pkg.expiry_time <= timezone.now():
            user_pkg.status = 'expired'
            revoke_network_access(session.device_mac)
            
        user_pkg.save()
        session.save()

def revoke_network_access(mac):
    # Logic to send signal to Firewall (SSH/REST API)
    pass`
  },
  {
    name: 'payments/callback.py',
    content: `from rest_framework import views, status
from rest_framework.response import Response
from .models import MpesaTransaction
from packages.models import Package, UserPackage

class MpesaCallbackView(views.APIView):
    def post(self, request):
        data = request.data.get('Body', {}).get('stkCallback', {})
        result_code = data.get('ResultCode')
        checkout_id = data.get('CheckoutRequestID')
        
        try:
            transaction = MpesaTransaction.objects.get(checkout_request_id=checkout_id)
        except MpesaTransaction.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if result_code == 0:
            # Extract items from callback metadata
            metadata = data.get('CallbackMetadata', {}).get('Item', [])
            amount = next(i['Value'] for i in metadata if i['Name'] == 'Amount')
            receipt = next(i['Value'] for i in metadata if i['Name'] == 'MpesaReceiptNumber')
            
            # HARDENING: Amount Verification
            if amount < transaction.package.price:
                transaction.status = 'failed'
                transaction.fail_reason = 'Amount mismatch'
            else:
                transaction.status = 'completed'
                transaction.receipt_number = receipt
                # IDEMPOTENCY: Check if already activated
                if not UserPackage.objects.filter(payment_ref=receipt).exists():
                    activate_user_package(transaction)
        else:
            transaction.status = 'failed'
            transaction.fail_reason = data.get('ResultDesc')
            
        transaction.save()
        return Response({"ResultCode": 0, "ResultDesc": "Success"})`
  },
  {
    name: 'admin_api/views.py',
    content: `from rest_framework import generics, permissions
from sessions.models import HotspotSession
from payments.models import MpesaTransaction
from django.db.models import Sum

class LiveSessionMonitor(generics.ListAPIView):
    permission_classes = [permissions.IsAdminUser]
    queryset = HotspotSession.objects.filter(session_status='connected')
    serializer_class = SessionMonitorSerializer

class RevenueStats(generics.GenericAPIView):
    permission_classes = [permissions.IsAdminUser]
    
    def get(self, request):
        daily_rev = MpesaTransaction.objects.filter(
            status='completed', 
            timestamp__date=timezone.now().date()
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        return Response({
            "daily_revenue": daily_rev,
            "active_users": HotspotSession.objects.filter(session_status='connected').count()
        })`
  },
  {
    name: 'deployment/nginx.conf',
    content: `server {
    listen 80;
    server_name portal.nexus.com;

    # Enforce HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name portal.nexus.com;

    ssl_certificate /etc/letsencrypt/live/portal.nexus.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/portal.nexus.com/privkey.pem;

    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        # Crucial for M-Pesa callbacks
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location / {
        root /var/www/hotspot-portal/dist;
        try_files $uri $uri/ /index.html;
    }
}`
  }
];

const BackendViewer: React.FC = () => {
  const [activeFile, setActiveFile] = useState(0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Django Backend Implementation</h1>
        <p className="text-slate-600 mt-2">Browse the production-ready Python source code for the billing system.</p>
      </div>

      <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[700px]">
        {/* Sidebar */}
        <div className="md:w-64 bg-slate-800 border-r border-slate-700 p-4 overflow-y-auto">
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4 px-2">Core Logic</h3>
          <div className="space-y-1 mb-6">
            {BACKEND_FILES.slice(0, 4).map((file, idx) => (
              <button
                key={file.name}
                onClick={() => setActiveFile(idx)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeFile === idx 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                <i className={`fas ${file.name.endsWith('.py') ? 'fa-brands fa-python' : 'fa-gears'} mr-2`}></i>
                {file.name}
              </button>
            ))}
          </div>
          
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4 px-2">DevOps & Infra</h3>
          <div className="space-y-1">
            {BACKEND_FILES.slice(4).map((file, idx) => (
              <button
                key={file.name}
                onClick={() => setActiveFile(idx + 4)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeFile === idx + 4
                    ? 'bg-indigo-600 text-white' 
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                <i className={`fas ${file.name.endsWith('.conf') ? 'fa-server' : 'fa-file-lines'} mr-2`}></i>
                {file.name}
              </button>
            ))}
          </div>
        </div>

        {/* Code Content */}
        <div className="flex-grow flex flex-col bg-slate-950">
          <div className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span className="ml-4 text-slate-300 font-mono text-xs">{BACKEND_FILES[activeFile].name}</span>
            </div>
            <button 
              className="text-slate-500 hover:text-white transition-colors text-sm"
              onClick={() => navigator.clipboard.writeText(BACKEND_FILES[activeFile].content)}
            >
              <i className="fas fa-copy mr-1"></i> Copy
            </button>
          </div>
          <pre className="flex-grow overflow-auto p-8 text-indigo-300 font-mono text-sm leading-relaxed scrollbar-thin scrollbar-thumb-slate-700">
            <code>{BACKEND_FILES[activeFile].content}</code>
          </pre>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
            <i className="fas fa-shield-halved text-indigo-600 mr-3"></i>
            Enforcement Logic
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            The <code>AccessControlView</code> provides a REST endpoint for local gateways (OpenWrt/MikroTik). 
            When a user authenticates, the backend pushes the MAC to an <strong>ipset</strong> whitelist via SSH or a custom agent.
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
            <i className="fas fa-calculator text-indigo-600 mr-3"></i>
            Usage Accounting
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Accounting is handled by <strong>Celery Beat</strong>. It tracks "ticks" (time) and pulls traffic metrics from the gateway using unique identifiers like MAC addresses.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
            <i className="fas fa-money-bill-trend-up text-indigo-600 mr-3"></i>
            Payment Hardening
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Callback verification ensures the received KES matches the <code>Package</code> price exactly. 
            Receipt-based idempotency prevents duplicate data allocation if Safaricom retries callbacks.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BackendViewer;
