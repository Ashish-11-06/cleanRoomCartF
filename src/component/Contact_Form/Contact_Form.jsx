import React from "react";
import { Form, Input, Button, Typography, message } from "antd";
import axios from "axios";
import "./Contact_Form.css";
import { BASE_URL } from "../../API/BaseURL";
import {
  FacebookFilled,
  InstagramFilled,
  WhatsAppOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

const ContactForm = () => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/contact/submit`, values);
      message.success(response.data.message);
    } catch (error) {
      message.error("Failed to submit query. Please try again.");
    }
  };

  return (
    <div className="contact-page">
      {/* Left: Form */}
      <div className="form-section">
        <Title level={3} className="form-heading">Feel Free to Ask</Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="contact-form"
        >
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input placeholder="Enter your full name" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[
              { required: true, message: "Please enter your phone number" },
              { len: 10, message: "Must be exactly 10 digits" },
              { pattern: /^[0-9]+$/, message: "Phone number must contain only digits" },
            ]}
          >
            <Input placeholder="Enter your phone number" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email address!" },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            name="companyName"
            label="Company Name"
            rules={[{ required: true, message: "Please enter company name" }]}
          >
            <Input placeholder="Enter your company name" />
          </Form.Item>

          <Form.Item
            name="comments"
            label="Comments / Questions"
            rules={[{ required: true, message: "Please enter your message" }]}
          >
            <Input.TextArea rows={4} placeholder="Enter your comments or questions here" />
          </Form.Item>

          <Form.Item className="form-btn-item">
            <Button className="submit-button" type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>

      {/* Right: Info */}
      <div className="info-section">
        <div className="info-box">
          <h3>Contact Details</h3>
          <p><MailOutlined className="icon" /> info@cleanroomcart.com</p>
          <p><PhoneOutlined className="icon" /> +91 9876543210</p>
        </div>

        <div className="info-box">
          <h3>Address</h3>
          <p>
            <EnvironmentOutlined className="icon" />
            A-302, Binawat Majestic,<br />
            Sasane Nagar Rd.,<br />
            Haveli, Hadapsar,<br />
            Pune-411028, Maharashtra
          </p>
        </div>

        <div className="info-box map-box">
          <h3>Location</h3>
          <iframe
            title="map"
            className="map-iframe"
            src="https://www.google.com/maps/embed?pb=!1m18..."
            frameBorder="0"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>

        <div className="info-box">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <FacebookFilled className="social-icon facebook" />
            <InstagramFilled className="social-icon instagram" />
            <WhatsAppOutlined className="social-icon whatsapp" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
