// AdminLogin.js
import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Radio } from 'antd';
import { UserOutlined, LockOutlined, KeyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../../API/BaseURL';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('admin');

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (role === 'superadmin') {
        if (values.email === 'super@gmail.com' && values.password === 'super') {
          localStorage.setItem('adminToken', 'superadmin-token');
          localStorage.setItem('role', 'superadmin');
          localStorage.setItem('adminName', 'Super Admin');
          message.success('Login successful!');
          navigate('/superadmin/dashboard');
        } else {
          message.error('Invalid super admin credentials!');
        }
      } else {
        const response = await fetch(`${BASE_URL}/api/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('adminToken', data.token);
          localStorage.setItem('adminName', data.name);
          localStorage.setItem('role', 'admin');
          message.success('Login successful!');
          navigate('/admin/dashboard');
        } else {
          message.error(data.message || 'Login failed!');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error('Login failed! Please try again.');
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
      background: '#f0f2f5'
    }}>
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <KeyOutlined style={{ marginRight: 9, color: 'black', fontSize: '20px' }} />
            <span style={{ fontSize: '20px' }}>Admin/SuperAdmin Login</span>
          </div>
        }
        style={{
          width: 400,
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          padding: '30px', // ✅ form padding
          borderRadius: '0px'
        }}
      >
        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          style={{ marginTop: 10 }}
        >
          <Form.Item style={{ textAlign: 'center' , padding: 15}}>
            <Radio.Group onChange={(e) => setRole(e.target.value)} value={role}>
              <Radio value="admin">Admin</Radio>
              <Radio value="superadmin">Super Admin</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Enter a valid email!' }
            ]}
            style={{ 
              marginBottom: '7px',
              marginLeft: '20px',
              marginRight: '20px',
              marginTop: '-65px' // ✅ email field margin
            }}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please input your password!' }]}
            style={{ 
              marginBottom: '7px',
              marginLeft: '20px',
              marginRight: '20px',
              marginTop: '-35px' // ✅ password field margin
            }}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item style={{ textAlign: 'center', marginTop: '-20px' }}> {/* ✅ button margin */}
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{
                width: '150px',
                backgroundColor: '#1677ff',
                border: 'none',
                padding: '6px 0',
                borderRadius: '0px',
              }}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AdminLogin;
