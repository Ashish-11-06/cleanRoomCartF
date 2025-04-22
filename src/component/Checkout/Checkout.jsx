import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Typography,
  Modal,
  Radio,
  Spin,
  message,
  Table,
} from "antd";
import axios from "axios";
import "./Checkout.css";
import { BASE_URL } from "../../API/BaseURL";
import styled from "styled-components";

const { Title, Text } = Typography;

const CheckoutContainer = styled.div`
  display: flex;
`;

const LeftSection = styled.div`
  flex: 1;
  padding-right: 20px;
  margin-left: 100px;
`;

const RightSection = styled.div`
  width: 500px;
`;

const SectionContainer = styled.div`
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 0px;
`;

const AddressContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 0px;
`;

const Checkout = () => {
  const [user, setUser] = useState(null);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [productDetails, setProductDetails] = useState([]);
  const [activeSection, setActiveSection] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [placingOrder, setPlacingOrder] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const selectedProducts = location.state?.selectedProducts || [];

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUser(userData);
      fetchUserData(userData._id);
      setActiveSection(2);
    }
  }, []);

  const handleChangeLogin = () => {
    navigate("/login");
  };

  const fetchUserData = async (userId) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/consumer/profile/${userId}`
      );
      const userProfile = data.user;

      if (userProfile) {
        const defaultAddr = {
          addressLine1: userProfile.addressLine1 || "",
          addressLine2: userProfile.addressLine2 || "",
          city: userProfile.city || "",
          state: userProfile.state || "",
          country: userProfile.country || "",
          zip: userProfile.zip || "",
        };
        setDefaultAddress(defaultAddr);
        setSelectedShippingAddress(defaultAddr);
      }

      const addressRes = await axios.get(
        `${BASE_URL}/api/address/addresses/user/${userId}`
      );
      setAddresses(addressRes.data.addresses || []);
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      message.error("Failed to load addresses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productDetailsPromises = selectedProducts.map(
          async (product) => {
            const response = await axios.get(
              `${BASE_URL}/api/product/get-by/${product.productId}`
            );
            const productData = response.data.product;
            return {
              ...productData,
              quantity: product.quantity,
              productCode: product.productCode,
            };
          }
        );

        const productDetails = await Promise.all(productDetailsPromises);
        setProductDetails(productDetails);
      } catch (error) {
        console.error("Error fetching product details:", error);
        message.error("Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };

    if (selectedProducts && selectedProducts.length > 0) {
      fetchProducts();
    }
  }, [selectedProducts]);

  const handleShippingAddressChange = () => {
    setIsModalVisible(true);
  };

  const handleSelectShippingAddress = (e) => {
    const selected = addresses.find(
      (addr) => addr.addressLine1 === e.target.value
    );
    setSelectedShippingAddress(selected);
    setIsModalVisible(false);
  };

  const calculateSubtotal = () =>
    productDetails.reduce((total, item) => {
      const selectedProduct = selectedProducts.find(
        (p) => p.productId === item._id
      );
      const price = selectedProduct ? selectedProduct.price : 0;
      return total + price * item.quantity;
    }, 0);

  const calculateTax = () => {
    return calculateSubtotal() * 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleDeliverHere = () => {
    if (!selectedShippingAddress) {
      message.error("Please select a shipping address.");
      return;
    }
    setActiveSection(3);
  };

  const columns = [
    {
      title: "Product Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img
          src={`${BASE_URL}${image}`}
          alt="Product"
          style={{ width: "50px", height: "50px" }}
        />
      ),
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Items",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text, record) => {
        const selectedProduct = selectedProducts.find(
          (p) => p.productId === record.key
        );
        const price = selectedProduct ? selectedProduct.price : 0;
        return `RS ${price}`;
      },
    },
    {
      title: "Total",
      key: "total",
      render: (record) => {
        const selectedProduct = selectedProducts.find(
          (p) => p.productId === record.key
        );
        const price = selectedProduct ? selectedProduct.price : 0;
        return `RS ${price * record.quantity}`;
      },
    },
  ];

  const dataSource = productDetails.map((item) => ({
    key: item._id,
    image: item.image,
    productName: item.productName,
    quantity: item.quantity,
  }));

  const UserInfoSection = () => (
    <SectionContainer>
      <Card className="checkout-card">
        <div className="logged-user-section">
          <div className="user-info-header">
            <div className="login-label">
              <span className="step-number">1</span>
              <span className="login-text">LOGIN</span>
              <span className="tick">✔</span>
            </div>
            <button className="change-btn" onClick={handleChangeLogin}>
              CHANGE
            </button>
          </div>

          <div className="user-details">
            <strong>
              {user?.firstName} {user?.lastName}
            </strong>
            <span className="email">{user?.email}</span>
          </div>
        </div>
      </Card>
    </SectionContainer>
  );

  const DeliveryAddressSection = () => (
    <SectionContainer>
      <Title level={5}>2. Delivery Address</Title>
      <Card className="checkout-card">
        <div className="delivery-address-section">
          <div className="delivery-header">
            <span className="step-number">2</span>
            <span className="step-title">DELIVERY ADDRESS</span>
            <button className="edit-btn" onClick={handleShippingAddressChange}>
              EDIT
            </button>
          </div>

          {loading ? (
            <Spin />
          ) : selectedShippingAddress ? (
            <div className="delivery-body">
              <div className="name-row">
                <strong className="name">
                  {selectedShippingAddress.name}
                </strong>
                <span className="badge">DEFAULT</span>
                <span className="mobile">{selectedShippingAddress.phone}</span>
              </div>
              <p className="address-text">
                {selectedShippingAddress.addressLine1},{" "}
                {selectedShippingAddress.addressLine2}
                <br />
                {selectedShippingAddress.city}, {selectedShippingAddress.state},{" "}
                {selectedShippingAddress.country} -{" "}
                <strong>{selectedShippingAddress.zip}</strong>
              </p>

              <Button
                type="primary"
                className="deliver-btn"
                onClick={handleDeliverHere}
              >
                DELIVER HERE
              </Button>
            </div>
          ) : (
            <p className="no-address">No address available</p>
          )}
        </div>
      </Card>
    </SectionContainer>
  );

  const OrderSummarySection = () => (
    <SectionContainer>
      <Title level={5}>3. Order Summary</Title>
      <Card className="checkout-card">
        <Title level={5}>Order Summary</Title>
        <Table dataSource={dataSource} columns={columns} pagination={false} />
        <div style={{ marginTop: "20px" }}>
          <p>Subtotal: RS {calculateSubtotal()}</p>
          <p>Tax: RS {calculateTax()}</p>
          <p>Total: RS {calculateTotal()}</p>
        </div>
        <Button
          type="primary"
          style={{
            backgroundColor: "#40476D",
            color: "#FFFFFF",
            border: "none",
            width: "140px",
            marginTop: "16px",
            borderRadius: "0px",
          }}
          onClick={() => setActiveSection(4)}
        >
          Continue to Payment
        </Button>
      </Card>
    </SectionContainer>
  );

  const PaymentSection = () => (
    <SectionContainer>
      <Title level={5}>4. Payment Method</Title>
      <Card className="checkout-card">
        <Radio.Group
          onChange={(e) => setPaymentMethod(e.target.value)}
          value={paymentMethod}
        >
          <Radio value="cod">Cash on Delivery (COD)</Radio>
        </Radio.Group>
        <Button
          type="primary"
          style={{
            backgroundColor: "#40476D",
            color: "#FFFFFF",
            border: "none",
            width: "140px",
            marginTop: "16px",
            borderRadius: "0px",
          }}
          onClick={handlePlaceOrder}
          disabled={placingOrder}
        >
          {placingOrder ? <Spin size="small" /> : "Place Order"}
        </Button>
      </Card>
    </SectionContainer>
  );

  const orderSummary = (
    <div className="order-summary-container">
      <h5 className="order-summary-title">
        Order Summary
        <span onClick={() => navigate("/cart")} className="edit-cart">
          Edit Cart
        </span>
      </h5>

      {loading ? (
        <Spin />
      ) : (
        <>
          {productDetails.map((item) => {
            const selectedProduct = selectedProducts.find(
              (p) => p.productId === item._id
            );
            const price = selectedProduct ? selectedProduct.price : 0;

            return (
              <div className="order-item" key={item._id}>
                <div className="item-details">
                  <img
                    className="item-image"
                    src={`${BASE_URL}${item.image}`}
                    alt={item.productName}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                    }}
                  >
                    <span className="item-name">{item.productName}</span>
                    <p style={{ marginTop: "4px" }}>{item.quantity} item(s)</p>
                    <span className="item-price">Price: RS {price}</span>
                    <span className="item-code">
                      Product Code: {selectedProduct?.productCode}
                    </span>
                  </div>
                </div>
                <p>RS {price * item.quantity}</p>
              </div>
            );
          })}
        </>
      )}

      <div className="price-summary">
        <div className="price-item">
          <p>Subtotal:</p>
          <p>RS {calculateSubtotal()}</p>
        </div>
        <div className="price-item">
          <p>Tax:</p>
          <p>RS {calculateTax()}</p>
        </div>
        <div className="price-item total">
          <p>Total:</p>
          <p>RS {calculateTotal()}</p>
        </div>
      </div>
    </div>
  );

  const handlePlaceOrder = async () => {
    setPlacingOrder(true);

    try {
      // Prepare order items
      const orderItems = productDetails.map((item) => {
        const selectedProduct = selectedProducts.find(
          (p) => p.productId === item._id
        );
        const price = selectedProduct ? selectedProduct.price : 0;

        return {
          productID: item._id,
          quantity: item.quantity,
          itemPrice: price,
          productCode: item.productCode,
        };
      });

      // Prepare order data
      const orderData = {
        userID: user._id,
        shippingAddress: selectedShippingAddress,
        paymentMethod: paymentMethod,
        orderTotal: calculateTotal(),
        items: orderItems,
      };

      // Send order data to the backend
      const response = await axios.post(`${BASE_URL}/api/order/orders`, orderData);

      if (response.status === 201) {
        message.success("Order placed successfully!");
        navigate("#", { state: { order: response.data } });
      } else {
        message.error("Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      message.error("Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <CheckoutContainer>
      <LeftSection>
        <Title level={3}>Checkout</Title>
        {activeSection >= 1 && <UserInfoSection />}
        {activeSection >= 2 && <DeliveryAddressSection />}
        {activeSection >= 3 && <OrderSummarySection />}
        {activeSection >= 4 && <PaymentSection />}
      </LeftSection>

      <RightSection>{orderSummary}</RightSection>

      <Modal
        title="Select an Address"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Title level={5}>Shipping Addresses</Title>
        <Radio.Group
          onChange={handleSelectShippingAddress}
          style={{ marginBottom: "16px" }}
        >
          {addresses.map((addr) => (
            <div key={addr._id} className="address-container">
              <Radio value={addr.addressLine1}>
                {addr.addressLine1}, {addr.addressLine2}, {addr.city},{" "}
                {addr.state}, {addr.zip}, {addr.country}
              </Radio>
            </div>
          ))}
        </Radio.Group>
      </Modal>
    </CheckoutContainer>
  );
};

export default Checkout;
