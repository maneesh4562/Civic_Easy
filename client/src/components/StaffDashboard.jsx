import React, { useEffect, useState } from 'react';
import API from '../api';

const StaffDashboard = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await API.get('/requests/assigned');
      setRequests(res.data);
    } catch (err) {
      alert('Error fetching requests');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await API.patch(`/requests/${id}/status`, { status });
      fetchRequests(); // refresh after update
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div>
      <h2>Staff Panel – Assigned Requests</h2>
      {requests.length === 0 && <p>No assigned requests</p>}
      {requests.map((req) => (
        <div key={req._id} style={{ border: '1px solid gray', padding: '10px', margin: '10px 0' }}>
          <h4>{req.title}</h4>
          <p>{req.description}</p>
          <small>Category: {req.category} | Status: {req.status}</small><br />
          <select value={req.status} onChange={(e) => handleStatusChange(req._id, e.target.value)}>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Resolved</option>
            <option>Rejected</option>
          </select>
        </div>
      ))}
    </div>
  );
};

export default StaffDashboard;
