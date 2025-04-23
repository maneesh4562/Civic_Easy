import React, { useState } from 'react';
import './AuthForm.css';

const AuthForm = ({ isLogin, onSubmit }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CITIZEN',  
    address: '',
    phone: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field ${name} changed to:`, value);
    setForm(prev => {
      const updated = { ...prev, [name]: value };
      console.log('Updated form state:', updated);
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', form);
    onSubmit(form);
  };

  return (
    <div className="auth-form-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        
        {!isLogin && (
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              placeholder="Full Name"
              onChange={handleChange}
              required={!isLogin}
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            placeholder="Email"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            placeholder="Password"
            onChange={handleChange}
            required
          />
        </div>

        {!isLogin && (
          <>
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select 
                id="role" 
                name="role" 
                value={form.role}
                onChange={handleChange}
                required
              >
                <option value="CITIZEN">Citizen</option>
                <option value="STAFF">Staff</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                name="address"
                value={form.address}
                placeholder="Your Address"
                onChange={handleChange}
                required={!isLogin}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                placeholder="Phone Number"
                onChange={handleChange}
                required={!isLogin}
              />
            </div>
          </>
        )}

        <button type="submit" className="submit-button">
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
