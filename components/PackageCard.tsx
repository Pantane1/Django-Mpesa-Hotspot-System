
import React from 'react';
import { Package } from '../types';

interface PackageCardProps {
  packageItem: Package;
  onSelect: () => void;
}

const PackageCard: React.FC<PackageCardProps> = ({ packageItem, onSelect }) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-100 hover:shadow-lg transition-all flex flex-col p-6 group">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{packageItem.name}</h3>
        <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mt-1">Valid for {packageItem.validityDays} Day(s)</p>
      </div>
      <div className="space-y-3 mb-6 flex-grow">
        <div className="flex items-center text-slate-600 text-sm">
          <i className="fas fa-database w-6 text-indigo-500"></i>
          <span>{(packageItem.dataLimitMb / 1024).toFixed(1)} GB Data</span>
        </div>
        <div className="flex items-center text-slate-600 text-sm">
          <i className="fas fa-clock w-6 text-indigo-500"></i>
          <span>{packageItem.timeLimitMinutes >= 1440 ? `${Math.floor(packageItem.timeLimitMinutes / 1440)} Days` : `${packageItem.timeLimitMinutes} Mins`} Time</span>
        </div>
      </div>
      <div className="mt-auto">
        <div className="text-2xl font-black text-slate-900 mb-4">
          KES {packageItem.price}
        </div>
        <button 
          onClick={onSelect}
          className="w-full bg-slate-50 hover:bg-indigo-600 hover:text-white text-indigo-600 font-bold py-2 rounded-lg border border-indigo-100 hover:border-indigo-600 transition-all text-sm"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default PackageCard;
