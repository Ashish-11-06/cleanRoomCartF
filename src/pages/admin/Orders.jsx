import React, { useEffect, useState } from 'react';
import { Table, Card, Typography, Tag, Spin, message, Select, Button, Row, Col } from 'antd';
import { BASE_URL } from '../../API/BaseURL';
import axios from 'axios';
import { DownOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [consumerMap, setConsumerMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchProductName = async (productId) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/product/get-by/${productId}`);
      return res.data?.product?.productName || 'N/A';
    } catch (err) {
      console.error(`Error fetching product name for ID ${productId}:`, err);
      return 'N/A';
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res1 = await axios.get(`${BASE_URL}/api/consumer/list`);
      const consumers = res1.data;

      const map = {};
      consumers.forEach(consumer => {
        if (consumer.email) {
          map[consumer.email] = {
            name: consumer.fullName || 'N/A',
            phone: consumer.phoneNumber || 'N/A'
          };
        }
      });
      setConsumerMap(map);

      const res2 = await axios.get(`${BASE_URL}/api/order/all-orders`);
      if (Array.isArray(res2.data)) {
        const enriched = await Promise.all(
          res2.data.map(async (order) => {
            const enrichedItems = await Promise.all(
              order.items.map(async (item) => {
                const productName = await fetchProductName(item.productID);
                return { ...item, productName };
              })
            );

            const email = order.userID?.email;
            const consumerInfo = map[email] || {};

            return {
              ...order,
              items: enrichedItems,
              userName: consumerInfo.name || 'N/A',
              userPhone: consumerInfo.phone || 'N/A',
            };
          })
        );
        setOrders(enriched);
        setFilteredOrders(enriched);
      } else {
        message.error('Unexpected data format from server.');
      }
    } catch (error) {
      console.error("Error fetching orders or consumers:", error);
      message.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/order/status/${orderId}`,
        { newStatus }
      );
      message.success(response.data.message);
      fetchOrders();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error updating order status';
      message.error(errorMessage);
    }
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    if (value === 'all') {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(order => order.orderStatus === value);
      setFilteredOrders(filtered);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'orderID',
      key: 'orderID',
      width: 150,
      render: (orderID) => <strong>{orderID}</strong>,
    },
    {
      title: 'User Email',
      dataIndex: ['userID', 'email'],
      key: 'user',
      render: (_, record) => <span>{record.userID?.email || 'N/A'}</span>,
    },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: 'Total (₹)',
      dataIndex: 'orderTotal',
      key: 'orderTotal',
      align: 'right',
      render: (value) => `₹${(value || 0).toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: (status) => {
        let color = 'blue';
        if (status === 'Delivered') color = 'green';
        else if (status === 'Cancelled') color = 'red';
        else if (status === 'Out for Delivery') color = 'orange';
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  const expandedRowRender = (record) => {
    const addr = record.shippingAddress || {};
    return (
      <div style={{ padding: '16px 24px', background: '#fafafa', borderRadius: 4 }}>
        <Row gutter={16}>
          <Col span={8}><strong>User Name:</strong> {record.userName}</Col>
          <Col span={8}><strong>Mobile Number:</strong> {record.userPhone}</Col>
          <Col span={8}><strong>Payment Method:</strong> {record.paymentMethod}</Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 8 }}>
          <Col span={24}><strong>Shipping Address:</strong> {`${addr.addressLine1 || ''}, ${addr.addressLine2 || ''}, ${addr.city || ''}, ${addr.state || ''} - ${addr.zip || ''}, ${addr.country || ''}`}</Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 8 }}>
          <Col span={12}>
            <strong>Update Order Status:</strong>
            <Select
              defaultValue={record.orderStatus}
              style={{ width: 200, marginLeft: 8 }}
              onChange={(value) => updateOrderStatus(record._id, value)}
            >
              {['Pending', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].map(status => (
                <Option key={status} value={status}>{status}</Option>
              ))}
            </Select>
          </Col>
        </Row>
        <div style={{ marginTop: 16 }}>
          <strong>Ordered Items:</strong>
          <Table
            dataSource={record.items}
            columns={[
              {
                title: 'Product Name',
                dataIndex: 'productName',
                key: 'productName',
              },
              {
                title: 'Product Code',
                dataIndex: 'productCode',
                key: 'productCode',
              },
              {
                title: 'Quantity',
                dataIndex: 'quantity',
                key: 'quantity',
                align: 'center',
              },
              {
                title: 'Price (₹)',
                dataIndex: 'itemPrice',
                key: 'itemPrice',
                align: 'right',
                render: (val) => `₹${(val || 0).toFixed(2)}`,
              },
            ]}
            pagination={false}
            rowKey="_id"
            size="small"
            bordered
            style={{ marginTop: 8 }}
          />
        </div>
      </div>
    );
  };

  return (
    <Card style={{ margin: 20, borderRadius: 8, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>All Orders</Title>
        <Select
          defaultValue="all"
          style={{ width: 220 }}
          onChange={handleStatusFilter}
          suffixIcon={<DownOutlined />}
        >
          <Option key="all" value="all">All Statuses</Option>
          <Option key="Pending" value="Pending">Pending</Option>
          <Option key="Shipped" value="Shipped">Shipped</Option>
          <Option key="Out for Delivery" value="Out for Delivery">Out for Delivery</Option>
          <Option key="Delivered" value="Delivered">Delivered</Option>
          <Option key="Cancelled" value="Cancelled">Cancelled</Option>
        </Select>
      </div>
      {loading ? (
        <Spin tip="Loading orders..." size="large" />
      ) : (
        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          bordered
          expandable={{
            expandedRowRender,
            expandRowByClick: true
          }}
          rowClassName={() => 'order-row'}
          style={{ border: '1px solid #f0f0f0' }}
        />
      )}
    </Card>
  );
};

export default Orders;
