import React from 'react';
import { Table, Card, Tag } from 'antd';

const Orders = () => {
  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Pending' ? 'orange' : 'green'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    }
  ];

  const data = []; // Will be populated from API

  return (
    <Card title="Orders">
      <Table columns={columns} dataSource={data} />
    </Card>
  );
};

export default Orders; 