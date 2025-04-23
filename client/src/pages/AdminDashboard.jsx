import React, { useState, useEffect } from 'react';
import API from '../api';
import './Dashboard.css';

const AdminDashboard = () => {
  const [services, setServices] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    department: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [servicesRes, requestsRes, staffRes, statsRes] = await Promise.all([
        API.get('/admin/services'),
        API.get('/admin/service-requests/all'),
        API.get('/admin/users/staff'),
        API.get('/admin/stats')
      ]);

      setServices(servicesRes.data);
      setServiceRequests(requestsRes.data);
      setStaffList(staffRes.data);
      console.log('Admin Dashboard Data:', {
        services: servicesRes.data,
        requests: requestsRes.data,
        staff: staffRes.data,
        stats: statsRes.data
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError('Failed to load admin dashboard data. ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    try {
      await API.post('/admin/services', newService);
      setNewService({ title: '', description: '', department: '' });
      fetchData();
      alert('Service created successfully');
    } catch (err) {
      console.error('Error creating service:', err);
      alert('Failed to create service: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleAssignStaff = async (requestId, staffId) => {
    if (!staffId) return;
    try {
      await API.patch(`/admin/service-requests/${requestId}/assign`, { staffId });
      fetchData();
      alert('Staff assigned successfully');
    } catch (err) {
      console.error('Error assigning staff:', err);
      alert('Failed to assign staff: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleUpdateRequestStatus = async (requestId, status) => {
    try {
      await API.patch(`/admin/service-requests/${requestId}/status`, { status });
      fetchData();
      alert('Status updated successfully');
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard admin-dashboard">
      <h1>Admin Dashboard</h1>

      {/* Create New Service Form */}
      <section className="dashboard-section">
        <h2>Create New Service</h2>
        <form onSubmit={handleCreateService} className="service-form">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={newService.title}
              onChange={(e) => setNewService({ ...newService, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={newService.description}
              onChange={(e) => setNewService({ ...newService, description: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Department</label>
            <input
              type="text"
              value={newService.department}
              onChange={(e) => setNewService({ ...newService, department: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="submit-btn">Create Service</button>
        </form>
      </section>

      {/* Service Requests Management */}
      <section className="dashboard-section">
        <h2>Service Requests</h2>
        <div className="requests-grid">
          {serviceRequests.map(request => (
            <div key={request._id} className="request-card">
              <h3>{request.service?.title || 'Unknown Service'}</h3>
              <p><strong>Citizen:</strong> {request.citizen?.name || 'Unknown'}</p>
              <p><strong>Status:</strong> {request.status}</p>
              <p><strong>Priority:</strong> {request.priority}</p>
              <p><strong>Description:</strong> {request.description}</p>
              <div className="request-actions">
                <select
                  onChange={(e) => handleAssignStaff(request._id, e.target.value)}
                  value={request.assignedStaff?._id || ''}
                >
                  <option value="">Assign Staff</option>
                  {staffList.map(staff => (
                    <option key={staff._id} value={staff._id}>
                      {staff.name}
                    </option>
                  ))}
                </select>
                <select
                  onChange={(e) => handleUpdateRequestStatus(request._id, e.target.value)}
                  value={request.status}
                >
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Available Services */}
      <section className="dashboard-section">
        <h2>Available Services</h2>
        <div className="services-grid">
          {services.map(service => (
            <div key={service._id} className="service-card">
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <p><strong>Department:</strong> {service.department}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
