import React, { useEffect, useState } from 'react';
import { Table, Card, Statistic, Input } from 'antd';
import axios from 'axios';
import { BASE_URL } from "../../API/BaseURL";

const fullNameKey = "fullName";
const emailKey = "email";
const phoneNumberKey = "phoneNumber";
const cityKey = "city";
const pincodeKey = "pincode";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/api/consumer/list`);
        setUsers(response.data);
        setFilteredUsers(response.data); // Initialize filtered users with all users
      } catch (err) {
        console.error('Error fetching consumers:', err);
        setError('Failed to load users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const columns = [
    {
      title: 'No.',
      key: 'serialNo',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Full Name',
      dataIndex: fullNameKey,
      key: fullNameKey,
    },
    {
      title: 'Email',
      dataIndex: emailKey,
      key: emailKey,
    },
    {
      title: 'Contact Number',
      dataIndex: phoneNumberKey,
      key: phoneNumberKey,
    },
    {
      title: 'City',
      dataIndex: cityKey,
      key: cityKey,
    },
    {
      title: 'Pincode',
      dataIndex: pincodeKey,
      key: pincodeKey,
    },
  ];

  const handleSearch = (value) => {
    setSearchQuery(value);
    const filtered = users.filter(user => {
      return Object.values(user).some(val => String(val).toLowerCase().includes(String(value).toLowerCase()));
    });
    setFilteredUsers(filtered);
  };

  return (
    <>
      <h2>Registered users</h2>
      <Card>
        {/* ✅ Display Total Users Count */}
        <Statistic
          title="Total Users"
          value={filteredUsers.length}
          style={{ marginBottom: 16 }}
        />
        <Input
          placeholder="Search users"
          value={searchQuery}
          onChange={e => handleSearch(e.target.value)}
          style={{ width: '100%', marginBottom: 16 }}
        />
        {loading ? (
          <p>Loading users...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <Table columns={columns} dataSource={filteredUsers} rowKey="_id" />
        )}
      </Card>
    </>
  );
};

export default Users;
