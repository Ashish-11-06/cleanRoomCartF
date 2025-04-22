import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, KeyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../API/BaseURL';

const AdminSignup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/admin/register`, {  
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        message.success('New Admin added successfully!');
      } else {
        message.error(data.message || 'Signup failed!');
      }
    } catch (error) {
      console.error('Signup error:', error);
      message.error('Signup failed! Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: '#f0f2f5',
      marginTop: '2px',
    }}>
      <Card 
        title={
          <>
            <KeyOutlined style={{ marginRight: 9, marginTop:9, color: 'black', fontSize:'25px' }} /> 
            <span style={{ fontSize:'20px'}}>Add New Admin</span>
          </>
        } 
        style={{
          width: 450, 
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)', 
          paddingTop:'20px',
          borderRadius: 0, // Remove border radius
        }}
      >
        <Form
          name="signup"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            style={{height:'70px',  padding:'15px 15px 0px 15px'}}
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Name" 
              size="large" 
              style={{ borderRadius: 0 }} // Remove border radius
            />
          </Form.Item>
          <Form.Item
            style={{height:'70px', padding:'15px 15px 0px 15px'}}
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="Email" 
              size="large" 
              style={{ borderRadius: 0 }} // Remove border radius
            />
          </Form.Item>
          <Form.Item
            style={{height:'70px',padding:'15px 15px 0px 15px'}}
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Password" 
              size="large" 
              style={{ borderRadius: 0 }} // Remove border radius
            />
          </Form.Item>
          <Form.Item
            style={{height:'70px',padding:'15px 15px 0px 15px'}}
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('Passwords do not match!');
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Confirm Password" 
              size="large" 
              style={{ borderRadius: 0 }} // Remove border radius
            />
          </Form.Item>
          <Form.Item
           style={{ height:'70px'}}>
            <Button
  style={{
    marginLeft: '15%',
    width: '70%',
    borderRadius: 0,
    backgroundColor: '#E16A54',
    color: 'white',
    border: 'none',
  }}
  type="primary"
  htmlType="submit"
  block
  size="large"
  loading={loading}
>
  Add Admin
</Button>

          </Form.Item>
         
        </Form>
      </Card>
    </div>
  );
};

export default AdminSignup;
