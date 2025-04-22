import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Select } from 'antd';
import axios from 'axios';
import { BASE_URL } from "../../API/BaseURL";

const Inquiry = () => {
  const [inquiries, setInquiries] = useState([]);
  const [filteredInquiries, setFilteredInquiries] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/contact/get`);
      const sortedInquiries = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setInquiries(sortedInquiries);
      setFilteredInquiries(sortedInquiries);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    }
  };

  const markAsResolved = async (id) => {
    try {
      await axios.patch(`${BASE_URL}/api/contact/${id}/resolve`, { status: 'Resolved' });
      fetchInquiries(); // Refresh the list after marking as resolved
    } catch (error) {
      console.error('Error marking as resolved:', error);
    }
  };

  const handleFilterChange = (value) => {
    setFilterStatus(value);
    if (value === '') {
      setFilteredInquiries(inquiries);
    } else {
      setFilteredInquiries(inquiries.filter(inquiry => inquiry.status === value));
    }
  };

  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Company Name',
      dataIndex: 'companyName',
      key: 'companyName',
    },
    {
      title: 'Comments',
      dataIndex: 'comments',
      key: 'comments',
    },
    {
      title: 'Submission Date',
      dataIndex: 'createdAt', // Ensure this field exists in your data
      key: 'createdAt',
      render: (date) => {
        if (date) {
          return new Date(date).toLocaleString(); // Format the date as desired
        } else {
          return 'N/A';
        }
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        record.status === 'pending' ? (
          <Button
            type="primary"
            className="custom-button"
            style={{
              width: '120px', // Adjust width as needed
              borderRadius: 0,
              border: '1px solid #F39E60',
              backgroundColor: '#F39E60',
              color: 'white',
            }}
            onClick={() => markAsResolved(record._id)}
          >
            Mark as Resolved
          </Button>

        ) : (
          <span>✔️</span>
        )
      ),
    },
  ];

  return (
    <>
      <h2>User Inquiries</h2>
      <div style={{ marginBottom: 20 }}>
        <Select
          value={filterStatus}
          onChange={handleFilterChange}
          style={{ width: 200 }}
          placeholder="Filter by Status"
        >
          <Select.Option value="">All</Select.Option>
          <Select.Option value="pending">Pending</Select.Option>
          <Select.Option value="Resolved">Resolved</Select.Option>
        </Select>
      </div>
      <Card>
        <Table columns={columns} dataSource={filteredInquiries} rowKey="_id" />
      </Card>
    </>
  );
};

export default Inquiry;
