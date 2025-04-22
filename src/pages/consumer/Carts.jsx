import React, { useState, useEffect } from "react";
import {
  Table,
  Typography,
  Button,
  InputNumber,
  Row,
  Col,
  Empty,
  Tooltip,
  Modal,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { ShoppingCartOutlined } from "@ant-design/icons";
import axios from "axios";
import { BASE_URL } from "../../API/BaseURL";

const { Title, Text } = Typography;

const CartPage = () => {
  const { cartItems, handleQuantityChange, handleRemoveItem, loading } =
    useCart();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [loadingProducts, setLoadingProducts] = useState(true);
  const navigate = useNavigate();

  // Add base font size state
  const [baseFontSize, setBaseFontSize] = useState(16);
  const actualFontSize = `${baseFontSize + 1}px`; // Increased by 1px

  // Confirmation modal state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  const showDeleteConfirm = (record) => {
    setItemToRemove(record);
    setIsModalVisible(true);
  };

  const handleConfirmRemove = () => {
    handleRemoveItem(itemToRemove);
    setIsModalVisible(false);
  };

  const handleCancelRemove = () => {
    setIsModalVisible(false);
  };

  // Fetch product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const productPromises = cartItems.map((item) =>
          axios.get(`${BASE_URL}/api/product/get-by/${item.productId}`)
        );

        const responses = await Promise.allSettled(productPromises);

        const productsData = {};
        responses.forEach((response, index) => {
          if (response.status === "fulfilled") {
            const productId = cartItems[index].productId;
            productsData[productId] = response.value.data.product;
          } else {
            console.error(
              `Failed to fetch product ${cartItems[index].productId}:`,
              response.reason
            );
          }
        });

        setProductDetails(productsData);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoadingProducts(false);
      }
    };

    if (cartItems.length > 0) {
      fetchProductDetails();
    } else {
      setLoadingProducts(false);
    }
  }, [cartItems]);

  if (loading || loadingProducts) {
    return (
      <div
        style={{ textAlign: "center", padding: "50px", fontSize: actualFontSize }}
      >
        Loading...
      </div>
    );
  }

  const calculateSubtotal = () => {
    return selectedRowKeys.reduce((total, key) => {
      const cartItem = cartItems.find((item) => item.productCode === key); // Use productCode here
      const price = cartItem?.price || 0;
      const quantity = cartItem?.quantity || 0;
      return total + price * quantity;
    }, 0);
  };

  const onSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys);
  };

  const handleCheckout = () => {
    if (selectedRowKeys.length === 0) {
      alert("Please select at least one product to proceed to checkout.");
      return;
    }

    const selectedProducts = cartItems
      .filter((item) => selectedRowKeys.includes(item.productCode)) // Use productCode here
      .map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        productCode: item.productCode,
        price: item.price,
      }));

    navigate("/checkout", { state: { selectedProducts } });
  };

  // Table columns with updated font size
  const columns = [
    {
      title: "Image",
      dataIndex: "productId",
      render: (productId) => {
        const imageUrl = productDetails[productId]?.image;
        if (!imageUrl)
          return <Text style={{ fontSize: actualFontSize }}>No Image</Text>;

        const fullImageUrl = `${BASE_URL}/uploads/${imageUrl.replace(
          "/uploads/",
          ""
        )}`;

        return (
          <Tooltip
            title={
              <img
                src={fullImageUrl}
                alt="Preview"
                style={{
                  width: "200px",
                  height: "200px",
                  objectFit: "contain",
                }}
              />
            }
          >
            <img
              src={fullImageUrl}
              alt="Product"
              style={{
                width: "100px",
                height: "100px",
                objectFit: "contain",
                border: "1px solid #ddd",
                borderRadius: "0px",
                cursor: "pointer",
              }}
            />
          </Tooltip>
        );
      },
    },
    {
      title: <span style={{ fontSize: actualFontSize }}>Name</span>,
      dataIndex: "productId",
      render: (productId) => (
        <Text
          style={{
            cursor: "pointer",
            color: "#1890ff",
            textDecoration: "underline",
            fontSize: actualFontSize,
          }}
          onClick={() => navigate(`/product/${productId}`)}
        >
          {productDetails[productId]?.productName}
        </Text>
      ),
    },
    {
      title: <span style={{ fontSize: actualFontSize }}>Product Code</span>,
      dataIndex: "productCode",
      render: (productCode) => (
        <Text style={{ fontSize: actualFontSize }}>{productCode || "N/A"}</Text>
      ),
    },
    {
      title: <span style={{ fontSize: actualFontSize }}>Price</span>,
      dataIndex: "price",
      render: (price) => (
        <Text style={{ fontSize: actualFontSize }}>
          ₹{price !== undefined ? price : "N/A"}
        </Text>
      ),
    },

    {
      title: <span style={{ fontSize: actualFontSize }}>Quantity</span>,
      dataIndex: "quantity",
      render: (quantity, record) => (
        <InputNumber
          min={1}
          value={quantity}
          onChange={(value) => handleQuantityChange(value, record)}
          style={{ width: "60px" }}
        />
      ),
    },
    {
      title: <span style={{ fontSize: actualFontSize }}>Total</span>,
      render: (_, record) => (
        <Text style={{ fontSize: actualFontSize }}>
          ₹{(record.price || 0) * (record.quantity || 0)}
        </Text>
      ),
    },

    {
      title: "Action",
      render: (_, record) => (
        <Button
          type="link"
          danger
          onClick={() => showDeleteConfirm(record)}
          style={{
            border: "2px solid #a0b3d6",
            color: "#2c3e50",
            padding: "5px 10px",
            borderRadius: "0px",
            transition: "0.3s",
            fontSize: actualFontSize,
          }}
          onMouseOver={(e) => (e.target.style.color = "#1a2942")}
          onMouseOut={(e) => (e.target.style.color = "#2c3e50")}
        >
          Remove
        </Button>
      ),
    },
  ];
  return (
    <div style={{ padding: "20px", fontSize: actualFontSize }}>
      {cartItems.length === 0 ? (
        <Empty
          description={
            <Title level={4} style={{ fontSize: actualFontSize }}>
              Your cart is empty
            </Title>
          }
        />
      ) : (
        <>
          <Title level={2} style={{ fontSize: "27px" }}>
            Your Cart ({cartItems.length} items)
          </Title>
          <Table
            dataSource={cartItems.map((item) => ({
              ...item,
              key: item.productCode, // Use productCode as the key
            }))}
            columns={columns}
            rowSelection={{
              selectedRowKeys,
              onChange: onSelectChange,
              getCheckboxProps: (record) => ({
                // Make sure the correct key is used here as well
                name: record.productCode,
              }),
            }}
            pagination={false}
          />

          <Row justify="space-between" style={{ marginTop: "30px" }}>
            <Col>
              <Button
                style={{
                  backgroundColor: "#40476D",
                  color: "white",
                  width: "180px",
                  borderRadius: "0px",
                  fontSize: actualFontSize,
                }}
                type="primary"
                size="large"
                onClick={() => navigate("/")}
              >
                <ShoppingCartOutlined style={{ marginRight: "5px" }} />
                Continue Shopping
              </Button>
            </Col>
            <Col>
              <div style={{ textAlign: "right" }}>
                <div style={{ marginBottom: "10px" }}>
                  <Text strong style={{ fontSize: actualFontSize }}>
                    Subtotal:
                  </Text>{" "}
                  <Text style={{ fontSize: actualFontSize }}>
                    ₹{calculateSubtotal()}
                  </Text>
                </div>
                <Button
                  style={{
                    backgroundColor: "#40476D",
                    color: "white",
                    width: "150px",
                    borderRadius: "0px",
                    fontSize: actualFontSize,
                  }}
                  type="primary"
                  size="large"
                  onClick={handleCheckout}
                >
                  Checkout
                </Button>
              </div>
            </Col>
          </Row>

          <Modal
            title="Confirm Removal"
            visible={isModalVisible}
            onOk={handleConfirmRemove}
            onCancel={handleCancelRemove}
            okText="Yes"
            cancelText="No"
            okButtonProps={{
              style: {
                backgroundColor: "#525a83", // Slightly faint of #40476D
                color: "#F8F8F8",
                borderRadius: 0,
                border: "none",
              },
            }}
            cancelButtonProps={{
              style: {
                backgroundColor: "#525a83",
                color: "#F8F8F8",
                borderRadius: 0,
                border: "none",
              },
            }}
          >
            <p style={{ fontSize: actualFontSize }}>
              Do you want to remove this item from your cart?
            </p>
          </Modal>
        </>
      )}
    </div>
  );
};

export default CartPage;
