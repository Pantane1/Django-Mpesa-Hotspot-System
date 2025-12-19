
import React, { useState } from 'react';
import PackageCard from './PackageCard';
import MpesaModal from './MpesaModal';
import { Package } from '../types';

const MOCK_PACKAGES: Package[] = [
  { id: 1, name: "Bronze - 1HR", dataLimitMb: 500, timeLimitMinutes: 60, price: 10, validityDays: 1, isActive: true },
  { id: 2, name: "Silver - 24HR", dataLimitMb: 2000, timeLimitMinutes: 1440, price: 50, validityDays: 1, isActive: true },
  { id: 3, name: "Gold - Weekly", dataLimitMb: 10000, timeLimitMinutes: 10080, price: 250, validityDays: 7, isActive: true },
  { id: 4, name: "Platinum - Monthly", dataLimitMb: 50000, timeLimitMinutes: 43200, price: 900, validityDays: 30, isActive: true },
];

interface PortalLandingProps {
  onLogin: (user: any) => void;
}

const PortalLanding: React.FC<PortalLandingProps> = ({ onLogin }) => {
  const [view, setView] = useState<'login' | 'packages'>('login');
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [credentials, setCredentials] = useState({ username: '', password: '', phone: '' });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (credentials.username && credentials.password) {
      setView('packages');
    }
  };

  const handlePurchase = (pkg: Package) => {
    setSelectedPackage(pkg);
  };

  const finalizePurchase = () => {
    // Simulate successful backend activation
    const mockUser = {
      username: credentials.username || 'DemoUser',
      phone: credentials.phone || '254700000000',
      email: `${credentials.username || 'user'}@example.com`
    };
    onLogin(mockUser);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {view === 'login' ? (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-slate-100">
          <div className="md:w-1/2 bg-indigo-600 p-10 flex flex-col justify-center text-white">
            <h1 className="text-4xl font-extrabold mb-4">Fast Wi-Fi Access.</h1>
            <p className="text-indigo-100 text-lg mb-8">Connect to our high-speed network in seconds. Simple pricing, no contracts.</p>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <i className="fas fa-check-circle mt-1"></i>
                <span>Instant M-Pesa payment</span>
              </div>
              <div className="flex items-start space-x-3">
                <i className="fas fa-check-circle mt-1"></i>
                <span>Unlimited bandwidth</span>
              </div>
              <div className="flex items-start space-x-3">
                <i className="fas fa-check-circle mt-1"></i>
                <span>Secure connection</span>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 p-10 bg-white">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Welcome Back</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Username or Phone</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="e.g. 254712345678"
                  value={credentials.username}
                  onChange={e => setCredentials({...credentials, username: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input 
                  type="password" 
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                  value={credentials.password}
                  onChange={e => setCredentials({...credentials, password: e.target.value})}
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-lg shadow-indigo-100"
              >
                Sign In to Connect
              </button>
            </form>
            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-slate-500 text-sm">New to Nexus? <a href="#" className="text-indigo-600 font-semibold">Create account</a></p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-fade-in">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900">Choose Your Plan</h2>
            <p className="text-slate-600 mt-2">Pick a package that fits your needs. Pay instantly with M-Pesa.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_PACKAGES.map(pkg => (
              <PackageCard 
                key={pkg.id} 
                packageItem={pkg} 
                onSelect={() => handlePurchase(pkg)} 
              />
            ))}
          </div>
          <div className="text-center">
            <button onClick={() => setView('login')} className="text-slate-500 hover:text-indigo-600 text-sm font-medium">
              <i className="fas fa-arrow-left mr-2"></i> Back to Login
            </button>
          </div>
        </div>
      )}

      {selectedPackage && (
        <MpesaModal 
          pkg={selectedPackage} 
          onClose={() => setSelectedPackage(null)} 
          onSuccess={finalizePurchase} 
        />
      )}
    </div>
  );
};

export default PortalLanding;
