
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  isAuthenticated: boolean;
  user: any;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, user, onLogout }) => {
  const location = useLocation();

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center">
              <div className="bg-indigo-600 p-2 rounded-lg mr-2">
                <i className="fas fa-wifi text-white text-xl"></i>
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">NEXUS<span className="text-indigo-600">HOTSPOT</span></span>
            </Link>
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/" className={`text-sm font-medium ${location.pathname === '/' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}>Portal</Link>
              <Link to="/docs" className={`text-sm font-medium ${location.pathname === '/docs' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}>Backend Architecture</Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs text-slate-500">Welcome,</span>
                  <span className="text-sm font-semibold text-slate-900">{user.username}</span>
                </div>
                <button 
                  onClick={onLogout}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-indigo-100">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
