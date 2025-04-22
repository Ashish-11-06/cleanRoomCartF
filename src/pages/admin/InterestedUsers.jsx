import React, { useEffect, useState } from "react";
import { Table, Card, Spin } from 'antd';
import axios from "axios";
import { BASE_URL } from "../../API/BaseURL";
import { useNavigate } from "react-router-dom";

const InterestedUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/admin/get/interested-users`);
        const sortedUsers = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setUsers(sortedUsers);
      } catch (error) {
        console.error("Error fetching interested users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const columns = [
    {
      title: 'User Name',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: "Product",
      key: "productName",
      render: (text, record) => (
        <span
          style={{
            color: '#1890ff',
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
          onClick={() => navigate(`/product/${record.productId?._id}`)}
        >
          {record.productId?.productName || "N/A"}
        </span>
      ),
    },
    {
      title: "Product ID",
      dataIndex: ["productId", "_id"],
      key: "productId",
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => {
        if (date) {
          return new Date(date).toLocaleString(); // Format the date as desired
        } else {
          return 'N/A';
        }
      },
    }
  ];

  return (
    <>
      <h2>Interested Users</h2>
      <Card>
        {loading ? <Spin size="large" /> : <Table columns={columns} dataSource={users} rowKey="_id" />}
      </Card>
    </>
  );
};

export default InterestedUsers;
