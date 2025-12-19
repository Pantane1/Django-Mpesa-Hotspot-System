
import React from 'react';

interface UserDashboardProps {
  user: any;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Account Overview</h1>
          <p className="text-slate-500">Monitoring your connection status and usage</p>
        </div>
        <div className="flex space-x-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">
            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
            Connected
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 font-medium">Data Balance</span>
            <i className="fas fa-database text-indigo-500"></i>
          </div>
          <div className="text-4xl font-black text-slate-900 mb-2">1.2 GB</div>
          <p className="text-sm text-slate-500">Remaining of 2.0 GB</p>
          <div className="mt-4 w-full bg-slate-100 rounded-full h-2">
            <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '60%' }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 font-medium">Time Remaining</span>
            <i className="fas fa-clock text-indigo-500"></i>
          </div>
          <div className="text-4xl font-black text-slate-900 mb-2">08h 45m</div>
          <p className="text-sm text-slate-500">Expires in 23 hours</p>
          <div className="mt-4 w-full bg-slate-100 rounded-full h-2">
            <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '35%' }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 font-medium">Device MAC</span>
            <i className="fas fa-microchip text-indigo-500"></i>
          </div>
          <div className="text-xl font-mono text-slate-900 mb-2">E4:5F:01:2A:44:88</div>
          <p className="text-sm text-slate-500">Registered to this profile</p>
          <button className="mt-4 text-indigo-600 text-sm font-semibold hover:underline">Manage Devices</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Recent Transactions</h3>
          <button className="text-sm text-indigo-600 font-medium">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Package</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Reference</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">Silver - 24HR</td>
                <td className="px-6 py-4 text-sm text-slate-500">May 24, 2024</td>
                <td className="px-6 py-4 text-sm font-mono text-slate-500">RKE829JSM0</td>
                <td className="px-6 py-4 text-sm font-semibold text-slate-900">KES 50.00</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">Success</span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">Bronze - 1HR</td>
                <td className="px-6 py-4 text-sm text-slate-500">May 22, 2024</td>
                <td className="px-6 py-4 text-sm font-mono text-slate-500">PKD9102LSM</td>
                <td className="px-6 py-4 text-sm font-semibold text-slate-900">KES 10.00</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">Success</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
