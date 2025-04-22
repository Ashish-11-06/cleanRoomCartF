import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './signup.css';
import { message } from 'antd'; // Ensure message is imported
import { UserAddOutlined } from "@ant-design/icons";
import { BASE_URL } from "../../../API/BaseURL";

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    country: '',
    state: '',
    zip: ''
  });
  const navigate = useNavigate(); // Hook for redirection

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (formData.password !== formData.confirmPassword) {
      message.error('Passwords do not match!');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/consumer/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        message.success('Signup successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000); // Redirect after 2 seconds
      } else {
        message.error(data.message);
      }
    } catch (error) {
      console.error('Signup error:', error);
      message.error('Something went wrong!');
    }
  };

  return (
    <div className="container">
      <form className='form' onSubmit={handleSubmit}>
        <h2 className='h2'>
          <UserAddOutlined style={{ marginRight: "8px", fontSize: "22px" }} />
          New Account
        </h2>
        <div className='div'>
          <label className='label'>
            <span className='label_span'>*</span>
            Email:</label>
          <input type="email" name="email" className='input' value={formData.email} onChange={handleChange} required />
        </div>
        <div className='div'>
          <label className='label'><span className='label_span'>*</span>Password:</label>
          <input type="password" name="password" className='input' value={formData.password} onChange={handleChange} required />
        </div>
        <div className='div'>
          <label className='label'><span className='label_span'>*</span>Confirm Password:</label>
          <input type="password" name="confirmPassword" className='input' value={formData.confirmPassword} onChange={handleChange} required />
        </div>
        <div className='div'>
          <label className='label'><span className='label_span'>*</span>First Name:</label>
          <input type="text" name="firstName" className='input' value={formData.firstName} onChange={handleChange} required />
        </div>
        <div className='div'>
          <label className='label'><span className='label_span'>*</span>Last Name:</label>
          <input type="text" name="lastName" className='input' value={formData.lastName} onChange={handleChange} required />
        </div>
        <div className='div'>
          <label className='label'><span className='label_span'>*</span>Phone Number:</label>
          <input type="text" name="phoneNumber" className='input' value={formData.phoneNumber} onChange={handleChange} required />
        </div>
        <div className='div'>
          <label className='label'><span className='label_span'>*</span>Address Line 1:</label>
          <input type="text" name="addressLine1" className='input' value={formData.addressLine1} onChange={handleChange} required />
        </div>
        <div className='div'>
          <label className='label'>Address Line 2:</label>
          <input type="text" name="addressLine2" className='input' value={formData.addressLine2} onChange={handleChange} />
        </div>
        <div className='div'>
          <label className='label'><span className='label_span'>*</span>City:</label>
          <input type="text" name="city" className='input' value={formData.city} onChange={handleChange} required />
        </div>
        <div className='div'>
          <label className='label'><span className='label_span'>*</span>Country:</label>
          <input type="text" name="country" className='input' value={formData.country} onChange={handleChange} required />
        </div>
        <div className='div'>
          <label className='label'><span className='label_span'>*</span>State/Province:</label>
          <input type="text" name="state" className='input' value={formData.state} onChange={handleChange} required />
        </div>
        <div className='div'>
          <label className='label'><span className='label_span'>*</span>Zip/Postcode:</label>
          <input type="text" name="zip" className='input' value={formData.zip} onChange={handleChange} required />
        </div>
        <button className='button' type="submit">Signup</button>
        <p className="custom-text">
          Already have an account? 
          <Link to="/login"> Log in Here</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
