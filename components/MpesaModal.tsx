
import React, { useState, useEffect } from 'react';
import { Package } from '../types';

interface MpesaModalProps {
  pkg: Package;
  onClose: () => void;
  onSuccess: () => void;
}

const MpesaModal: React.FC<MpesaModalProps> = ({ pkg, onClose, onSuccess }) => {
  const [step, setStep] = useState<'phone' | 'sending' | 'waiting' | 'success'>('phone');
  const [phone, setPhone] = useState('254');

  const initiateStk = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('sending');
    setTimeout(() => setStep('waiting'), 1500);
  };

  useEffect(() => {
    if (step === 'waiting') {
      const timer = setTimeout(() => {
        setStep('success');
        setTimeout(() => onSuccess(), 2000);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
        <div className="bg-emerald-600 p-6 flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <i className="fas fa-mobile-screen-button"></i>
            </div>
            <h3 className="text-lg font-bold">M-Pesa Payment</h3>
          </div>
          <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="p-8">
          {step === 'phone' && (
            <form onSubmit={initiateStk} className="space-y-6">
              <div className="text-center">
                <p className="text-slate-500 text-sm">Pay KES {pkg.price} for {pkg.name}</p>
                <h4 className="text-xl font-bold text-slate-800 mt-1">Enter M-Pesa Number</h4>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Phone Number</label>
                <input 
                  type="tel"
                  required
                  placeholder="2547XXXXXXXX"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-lg font-mono focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-100 transition-all flex items-center justify-center space-x-2"
              >
                <span>Pay via STK Push</span>
                <i className="fas fa-arrow-right"></i>
              </button>
            </form>
          )}

          {step === 'sending' && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin mb-4 text-emerald-600">
                <i className="fas fa-circle-notch text-4xl"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-800">Initiating STK Push...</h3>
              <p className="text-slate-500 mt-2">Please wait as we contact Safaricom</p>
            </div>
          )}

          {step === 'waiting' && (
            <div className="text-center py-8">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 animate-ping bg-emerald-400 rounded-full opacity-75"></div>
                <div className="relative bg-emerald-600 w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl">
                  <i className="fas fa-fingerprint"></i>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-800">Check Your Phone</h3>
              <p className="text-slate-500 mt-2 px-6">Enter your M-Pesa PIN on your mobile device to complete the transaction.</p>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <div className="bg-emerald-100 text-emerald-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                <i className="fas fa-check"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-800">Payment Successful!</h3>
              <p className="text-slate-500 mt-2">Activating your hotspot access...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MpesaModal;
