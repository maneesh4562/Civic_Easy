import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import CitizenDashboard from './pages/CitizenDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';

const App = () => {
  const getDefaultDashboard = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log('Current user from localStorage:', user);
    if (!user) return '/login';
    
    switch (user.role) {
      case 'CITIZEN':
        console.log('Redirecting to citizen dashboard');
        return '/citizen-dashboard';
      case 'STAFF':
        return '/staff-dashboard';
      case 'ADMIN':
        return '/admin-dashboard';
      default:
        return '/login';
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log('App mounted, current user:', user);
  }, []);

  // Protected Route component
  const ProtectedRoute = ({ children, allowedRoles }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
      return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }

    return children;
  };

  return (
    <Router>
      <div>
        <Navbar />
        <div className="container">
          <Routes>
            <Route 
              path="/" 
              element={
                <Navigate to={getDefaultDashboard()} replace />
              } 
            />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/citizen-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['CITIZEN']}>
                  <CitizenDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;