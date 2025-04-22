import { Form, Input, Button, message } from 'antd';
import { Link, useParams } from 'react-router-dom';
import { BASE_URL } from '../../API/BaseURL';
import axios from 'axios';
import { SyncOutlined } from '@ant-design/icons';

const ResetPassword = () => {
  const { token } = useParams(); 
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    // Show confirmation alert before proceeding
    if (!window.confirm("Are you sure you want to change your password?")) {
      return;
    }
    try {
      // POST both newPassword and confirmPassword to backend
      const { data } = await axios.post(`${BASE_URL}/api/consumer/reset-password/${token}`, values);
      message.success(data.message);
      form.resetFields();
    } catch (error) {
      message.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div style={{ padding: '50px 0px 0px 25%' }}>
      <Form style={{ padding: '20px' }} onFinish={handleSubmit}>
        <h2 style={{ padding: '0px 0px 0px -10px', justifyContent: 'left' }}>
          <SyncOutlined style={{ fontSize: '24px', paddingRight: '10px' }} />
          Reset Password
        </h2>
        <Form.Item
          style={{height:'55px'}}
          name="newPassword"
          rules={[{ required: true, message: 'Enter new password!' }]}
          hasFeedback
        >
          <Input.Password placeholder="New Password" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          dependencies={['newPassword']}
          hasFeedback
          rules={[
            { required: true, message: 'Please confirm your password!' },
           
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords do not match!'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm Password" />
        </Form.Item>
        <Button
          style={{
            backgroundColor: '#40476D',
            border: 'none',
            color: 'white',
            marginLeft: '20%',
            width: '60%',
            borderRadius: '0px' // Set to 0 for sharp edges
          }}
          type="primary"
          htmlType="submit"
        >
          Reset Password
        </Button>
        <p style={{display:'flex',justifyContent:'center'}}>
          <Link to='/login'>Back to Login</Link>
        </p>
      </Form>
    </div>
  );
};

export default ResetPassword;
