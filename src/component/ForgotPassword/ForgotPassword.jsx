import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { SyncOutlined } from '@ant-design/icons';
import { BASE_URL } from '../../API/BaseURL';
import './ForgotPassword.css'

const ForgotPassword = () => {
  const handleSubmit = async (values) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/api/consumer/forgot-password`, values);
      message.success(data.message);
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.message || "Failed to send reset link");
      } else {
        message.error("Something went wrong");
      }
    }
  };

  return (
    <div style={{ padding: '50px 0px 0px 25%' }}>
      <Form style={{ padding: '20px' }} onFinish={handleSubmit}>
        <h2 style={{ padding: '0px 0px 0px 0px', justifyContent: 'left' }}>
          <SyncOutlined style={{ fontSize: '22px' }} /> Forgot Password
        </h2>
        <Form.Item
          style={{ marginTop: '50px', height: '50px' }}
          name="email"
          rules={[
            { required: true, message: 'Please enter your email!' },
            { type: 'email', message: 'Invalid email address' }
          ]}
        >
          <Input style={{ color: 'black' }} placeholder="Enter your email" />
        </Form.Item>
        <Button
          style={{
            backgroundColor: '#40476D',
            border: 'none',
            color: 'white',
            marginLeft: '20%',
            width: '60%',
            borderRadius: '0px' // Changed to 0px for sharp edges
          }}
          type="primary"
          htmlType="submit"
        >
          Send Reset Link
        </Button>
      </Form>
    </div>
  );
};

export default ForgotPassword;
