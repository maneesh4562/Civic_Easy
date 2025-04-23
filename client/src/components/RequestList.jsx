import React, { useEffect, useState } from 'react';
import API from '../api';

const RequestList = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    API.get('/requests')
      .then((res) => setRequests(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <h3>Your Requests</h3>
      {requests.map((req) => (
        <div key={req._id} style={{ border: '1px solid gray', marginBottom: '10px' }}>
          <h4>{req.title} - <i>{req.status}</i></h4>
          <p>{req.description}</p>
          <small>Category: {req.category}</small>
        </div>
      ))}
    </div>
  );
};

export default RequestList;
