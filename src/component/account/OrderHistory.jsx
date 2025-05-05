import React, { useEffect, useState } from 'react';
import { Table, Tag, Spin, Steps } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { BASE_URL } from '../../API/BaseURL';

 // Change if needed
const { Step } = Steps;

const statusStages = ['Pending', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const userData = JSON.parse(localStorage.getItem('user'));
    const userId = userData?._id;

    // Fetch product name helper
    const fetchProductName = async (productId) => {
        try {
            const res = await axios.get(`${BASE_URL}/api/product/get-by/${productId}`);
            return res.data?.product?.productName || 'N/A';
        } catch (err) {
            console.error(`Error fetching product name for ID ${productId}:`, err);
            return 'N/A';
        }
    };

    useEffect(() => {
        const fetchOrdersWithProductNames = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/order/user-orders/${userId}`);
                if (res.data.success) {
                    const ordersWithNames = await Promise.all(res.data.data.map(async (order) => {
                        const itemsWithNames = await Promise.all(order.items.map(async (item) => {
                            const productName = await fetchProductName(item.productID?._id);
                            return {
                                ...item,
                                productName
                            };
                        }));
                        return { ...order, items: itemsWithNames };
                    }));
                    setOrders(ordersWithNames);
                }
            } catch (err) {
                console.error('Error fetching orders:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrdersWithProductNames();
    }, [userId]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'orange';
            case 'Confirmed': return 'blue';
            case 'Shipped': return 'purple';
            case 'Out for Delivery': return 'gold';
            case 'Delivered': return 'green';
            default: return 'gray';
        }
    };

    const getCurrentStep = (status) => statusStages.indexOf(status);

    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'orderID',
            key: 'orderID',
        },
        {
            title: 'Date',
            dataIndex: 'orderDate',
            key: 'orderDate',
            render: date => moment(date).format('DD MMM YYYY')
        },
        {
            title: 'Total (₹)',
            dataIndex: 'orderTotal',
            key: 'orderTotal',
            render: total => `₹${total.toFixed(2)}`
        },
        {
            title: 'Status',
            dataIndex: 'orderStatus',
            key: 'orderStatus',
            render: status => <Tag color={getStatusColor(status)}>{status}</Tag>
        },
    ];

    if (loading) return <Spin tip="Loading orders..." className="mt-10" />;

    return (
        <div className="p-6">
            <h3 className="text-xl font-semibold mb-4">My Orders</h3>
            <Table
                columns={columns}
                dataSource={orders}
                rowKey="_id"
                expandable={{
                    expandedRowRender: (record) => (
                        <div>
                            <h4 className="font-medium mb-2">Items:</h4>
                            {record.items.map(item => (
                                <div key={item._id} style={{ marginBottom: 8 }}>
                                    <div><strong>{item.productName}</strong> (Code: {item.productCode})</div>
                                    <div>Qty: {item.quantity} | ₹{item.itemPrice}</div>
                                </div>
                            ))}

                            <h4 className="font-medium mt-4 mb-1">Shipping Address:</h4>
                            <div>
                                {Object.values(record.shippingAddress || {}).filter(Boolean).join(', ')}
                            </div>

                            <h4 className="font-medium mt-4 mb-1">Payment Method:</h4>
                            <div>{record.paymentMethod}</div>

                            <h4 className="font-medium mt-4 mb-1">Order Status Timeline:</h4>
                            <Steps
                                current={getCurrentStep(record.orderStatus)}
                                size="small"
                                style={{ marginTop: 16 }}
                                responsive
                            >
                                {statusStages.map(stage => (
                                    <Step
                                        key={stage}
                                        title={stage}
                                        status={statusStages.indexOf(record.orderStatus) >= statusStages.indexOf(stage) ? 'finish' : 'wait'}
                                    />
                                ))}
                            </Steps>
                        </div>
                    ),
                }}
            />
        </div>
    );
};

export default OrderHistory;
