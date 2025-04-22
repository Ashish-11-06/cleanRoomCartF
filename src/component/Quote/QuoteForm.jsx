import React, { useState, useEffect } from "react";
import { Form, Input, Button, Typography, message, AutoComplete } from "antd";
import axios from "axios";
import "./QuoteForm.css";
import { BASE_URL } from "../../API/BaseURL";

const { Title, Paragraph } = Typography;

const QuoteForm = () => {
  const [form] = Form.useForm();
  const [productSuggestions, setProductSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [loading, setLoading] = useState(false);

  const validateMessages = {
    types: {
      email: 'Please enter a valid email address!',
    },
  };

  const onFinish = async (values) => {
    if (values.email !== values.confirmEmail) {
      message.error("Email and Confirm Email must match.");
      return;
    }

    const payload = {
      fullName: values.fullName,
      email: values.email,
      phone: values.phone,
      companyName: values.companyName,
      serviceInterested: values.product,
      message: values.requirement + "\nAddress: " + values.address,
    };

    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}/api/quote/submit`, payload);
      message.success(response.data.message || "Quote submitted successfully!");
      form.resetFields();
      setSelectedProduct("");
    } catch (error) {
      console.error("Error submitting quote:", error.response?.data || error.message);
      message.error(error.response?.data?.message || "Failed to submit quote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = () => {
    message.error("Please fill out all required fields correctly.");
  };

  // Fetch product suggestions
  useEffect(() => {
    if (searchTerm.trim().length === 0) {
      setProductSuggestions([]);
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/product/search?name=${searchTerm}`
        );
        setProductSuggestions(response.data.products.map(p => ({
          value: p.productName
        })));
      } catch (error) {
        console.error("Error fetching products:", error);
        setProductSuggestions([]);
      }
    };

    const debounceTimer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  return (
    <div className="container-quote">
      <Title level={2} className="quote-title">
        Get a Free Quote
      </Title>
      <Paragraph className="quote-description">
        Please fill out the form below to receive a free quote for cleanroom equipment.
      </Paragraph>

      <div className="form-wrapper">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          validateMessages={validateMessages}
        >
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true, message: "Please enter your full name" }]}
            style={{ marginBottom: '-35px' }} // Reduced margin
          >
            <Input placeholder="Enter your full name" />
          </Form.Item>

          <Form.Item
            name="product"
            label="Product Interested"
            rules={[{ required: true, message: "Please select a product" }]}
            style={{ marginBottom: '-35px' }} // Reduced margin
          >
            <AutoComplete
              options={productSuggestions}
              onSearch={setSearchTerm}
              onSelect={(value) => setSelectedProduct(value)}
              placeholder="Which product are you interested in?"
            />
          </Form.Item>

          <Form.Item
            name="requirement"
            label={
              selectedProduct 
                ? <span>Description of Requirement for <span style={{ color: "green", fontSize: "16px", fontWeight: "bold" }}>{selectedProduct}</span></span>
                : "Description of Requirement"
            }
            rules={[{ required: true, message: "Please describe your requirement" }]}
            style={{ marginBottom: '-35px' }} // Reduced margin
          >
            <Input.TextArea
              rows={4}
              placeholder={
                selectedProduct 
                  ? `Describe what kind of ${selectedProduct} you want`
                  : "Mention dimensions, quantity, customization needs, etc."
              }
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email Address"
            rules={[{ required: true, type: 'email' }]}
            style={{ marginBottom: '-35px' }} // Reduced margin
          >
            <Input placeholder="Enter your email address" />
          </Form.Item>

          <Form.Item
            name="confirmEmail"
            label="Confirm Email Address"
            rules={[{ required: true, type: 'email' }]}
            style={{ marginBottom: '-35px' }} // Reduced margin
          >
            <Input placeholder="Re-enter your email address" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[
              { required: true, message: "Please enter your phone number" },
              { pattern: /^[0-9]{10}$/, message: "Phone number must be exactly 10 digits" },
            ]}
            style={{ marginBottom: '-35px' }} // Reduced margin
          >
            <Input placeholder="Enter your phone number" />
          </Form.Item>

          <Form.Item
            name="companyName"
            label="Company Name"
            rules={[{ required: true, message: "Please enter your company name" }]}
            style={{ marginBottom: '-35px' }} // Reduced margin
          >
            <Input placeholder="Enter your company name" />
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please enter your address" }]}
            style={{ marginBottom: '-35px' }} // Reduced margin
          >
            <Input.TextArea rows={2} placeholder="Enter your company or delivery address" />
          </Form.Item>

          <Form.Item>
            <Button
              className="quote-button"
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              {loading ? "Submitting..." : "Submit Quote"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default QuoteForm;
