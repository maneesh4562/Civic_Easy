import React, { useState, useEffect } from 'react';
import API from '../api';
import './Dashboard.css';

const CitizenDashboard = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [myRequests, setMyRequests] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [requestForm, setRequestForm] = useState({
    description: '',
    priority: 'MEDIUM'
  });

  useEffect(() => {
    console.log('CitizenDashboard mounted');
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token);
    const userData = JSON.parse(localStorage.getItem('user'));
    console.log('User data from localStorage:', userData);
    setUser(userData);
    fetchServices();
    fetchMyRequests();
  }, []);

  const fetchServices = async () => {
    try {
      console.log('Fetching services...');
      const response = await API.get('/services');
      console.log('Services response:', response.data);
      setServices(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to fetch services');
      setLoading(false);
    }
  };

  const fetchMyRequests = async () => {
    try {
      console.log('Fetching my requests...');
      const response = await API.get('/service-requests/my-requests');
      console.log('My requests response:', response.data);
      setMyRequests(response.data);
    } catch (err) {
      console.error('Error fetching my requests:', err);
    }
  };

  const handleRequestSubmit = async (serviceId) => {
    try {
      console.log('Submitting service request:', {
        serviceId,
        description: requestForm.description,
        priority: requestForm.priority
      });
      const response = await API.post('/service-requests', {
        serviceId,
        description: requestForm.description,
        priority: requestForm.priority
      });
      console.log('Service request created:', response.data);
      setMyRequests([response.data, ...myRequests]);
      setSelectedService(null);
      setRequestForm({ description: '', priority: 'MEDIUM' });
      alert('Service request submitted successfully!');
    } catch (err) {
      console.error('Error submitting request:', err);
      alert('Failed to submit service request. Please try again.');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard">
      <h1>Welcome to CivicEase{user ? `, ${user.name}` : ''}</h1>
      
      {/* Service Request Form */}
      {selectedService && (
        <div className="request-form-container">
          <h2>Request Service: {selectedService.title}</h2>
          <div className="request-form">
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={requestForm.description}
                onChange={(e) => setRequestForm({ ...requestForm, description: e.target.value })}
                placeholder="Describe your request..."
                required
              />
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select
                value={requestForm.priority}
                onChange={(e) => setRequestForm({ ...requestForm, priority: e.target.value })}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            <div className="form-actions">
              <button 
                className="submit-btn"
                onClick={() => handleRequestSubmit(selectedService._id)}
                disabled={!requestForm.description}
              >
                Submit Request
              </button>
              <button 
                className="cancel-btn"
                onClick={() => setSelectedService(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* My Requests */}
      <div className="my-requests-container">
        <h2>My Service Requests</h2>
        {myRequests.length === 0 ? (
          <p>No service requests yet.</p>
        ) : (
          <div className="requests-list">
            {myRequests.map(request => (
              <div key={request._id} className="request-card">
                <h3>{request.service.title}</h3>
                <p>{request.description}</p>
                <p><strong>Status:</strong> {request.status}</p>
                <p><strong>Priority:</strong> {request.priority}</p>
                <p><strong>Submitted:</strong> {new Date(request.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Services */}
      <div className="services-container">
        <h2>Available Services</h2>
        {services.length === 0 ? (
          <p>No services available at the moment.</p>
        ) : (
          <div className="services-grid">
            {services.map(service => (
              <div key={service._id} className="service-card">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <p><strong>Department:</strong> {service.department}</p>
                {!selectedService && (
                  <button 
                    className="request-btn"
                    onClick={() => setSelectedService(service)}
                  >
                    Request Service
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CitizenDashboard;
