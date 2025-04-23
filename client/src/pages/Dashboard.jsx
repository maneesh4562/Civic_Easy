import React from 'react';
import CitizenDashboard from '../components/CitizenDashboard';
import StaffDashboard from '../components/StaffDashboard';
import AdminDashboard from './AdminDashboard';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) return <h2>Please login</h2>;

  switch (user.role) {
    case 'CITIZEN':
      return <CitizenDashboard />;
    case 'STAFF':
      return <StaffDashboard />;
    case 'ADMIN':
      return <AdminDashboard />;
    default:
      return <h2>Invalid Role</h2>;
  }
};

export default Dashboard;
