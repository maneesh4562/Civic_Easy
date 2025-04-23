import React, { useState } from 'react';
import API from '../api';

const RequestForm = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Water'
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/requests', form);
      alert('Request Submitted!');
      setForm({ title: '', description: '', category: 'Water' });
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Raise a New Request</h3>
      <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
      <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
      <select name="category" value={form.category} onChange={handleChange}>
        <option>Water</option>
        <option>Electricity</option>
        <option>Road</option>
        <option>Garbage</option>
        <option>Other</option>
      </select>
      <button type="submit">Submit Request</button>
    </form>
  );
};

export default RequestForm;
