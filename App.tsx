
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PortalLanding from './components/PortalLanding';
import UserDashboard from './components/UserDashboard';
import BackendViewer from './components/BackendViewer';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Mock initial auth check
  useEffect(() => {
    const savedUser = localStorage.getItem('hotspot_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar 
          isAuthenticated={isAuthenticated} 
          user={user} 
          onLogout={() => {
            localStorage.removeItem('hotspot_user');
            setUser(null);
            setIsAuthenticated(false);
          }} 
        />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <PortalLanding onLogin={(u) => {
                setUser(u);
                setIsAuthenticated(true);
                localStorage.setItem('hotspot_user', JSON.stringify(u));
              }} />
            } />
            <Route path="/dashboard" element={
              isAuthenticated ? <UserDashboard user={user} /> : <Navigate to="/" />
            } />
            <Route path="/docs" element={<BackendViewer />} />
          </Routes>
        </main>
        <footer className="bg-slate-900 text-slate-400 py-6 text-center text-sm">
          <p>&copy; 2024 Nexus Hotspot Solutions. Powered by Django & M-Pesa.</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
