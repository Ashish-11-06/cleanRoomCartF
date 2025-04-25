import React, { useEffect, useState } from 'react';
import { Table, Card, Typography, Tag, Spin, message, Select } from 'antd';
import axios from 'axios';
import { BASE_URL } from "../../API/BaseURL";

const { Title } = Typography;
const { Option } = Select;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
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

  const enrichOrdersWithProductNames = async (orders) => {
    return await Promise.all(
      orders.map(async (order) => {
        const enrichedItems = await Promise.all(
          order.items.map(async (item) => {
            const productName = await fetchProductName(item.productID);
            return { ...item, productName };
          })
        );
        return { ...order, items: enrichedItems };
      })
    );
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/order/all-orders`);
      if (Array.isArray(res.data)) {
        const enriched = await enrichOrdersWithProductNames(res.data);
        setOrders(enriched);
        setFilteredOrders(enriched);
      } else {
        message.error('Unexpected data format from server.');
        setOrders([]);
        setFilteredOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error('Failed to fetch orders');
      setOrders([]);
      setFilteredOrders([]);
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
      render: (value) => `₹${value.toFixed(2)}`,
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

  const expandedRowRender = (record) => (
    <div style={{ padding: '16px 24px', background: '#fafafa', borderRadius: 4 }}>
      <div style={{ marginBottom: 16 }}>
        <strong>Payment Method:</strong> {record.paymentMethod}
      </div>
      <div style={{ marginBottom: 16 }}>
        <strong>Shipping Address:</strong> {`${record.shippingAddress?.addressLine1}, ${record.shippingAddress?.addressLine2}, ${record.shippingAddress?.city}, ${record.shippingAddress?.state} - ${record.shippingAddress?.zip}, ${record.shippingAddress?.country}`}
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <strong>Update Order Status:</strong>
        <Select
          defaultValue={record.orderStatus}
          style={{ width: 200, marginLeft: 8 }}
          onChange={(value) => updateOrderStatus(record._id, value)}
        >
          <Option value="Pending">Pending</Option>
          <Option value="Shipped">Shipped</Option>
          <Option value="Out for Delivery">Out for Delivery</Option>
          <Option value="Delivered">Delivered</Option>
          <Option value="Cancelled">Cancelled</Option>
        </Select>
      </div>

      <div>
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
              render: (val) => `₹${val.toFixed(2)}`,
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

  return (
    <Card style={{ margin: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>All Orders</Title>
        <Select
          defaultValue="all"
          style={{ width: 200 }}
          onChange={handleStatusFilter}
        >
          <Option value="all">All Statuses</Option>
          <Option value="Pending">Pending</Option>
          <Option value="Shipped">Shipped</Option>
          <Option value="Out for Delivery">Out for Delivery</Option>
          <Option value="Delivered">Delivered</Option>
          <Option value="Cancelled">Cancelled</Option>
        </Select>
      </div>
      {loading ? (
        <Spin tip="Loading orders..." />
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


