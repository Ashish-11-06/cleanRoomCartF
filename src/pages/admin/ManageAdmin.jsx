import React, { useState, useEffect } from "react";
import { Table, Card, Button, Space, message } from "antd";
import { TeamOutlined, DeleteOutlined } from "@ant-design/icons";
import { BASE_URL } from "../../API/BaseURL";

const ManageAdmin = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/admin/all`);
      const data = await response.json();
      if (data.success) {
        setAdmins(data.data);
      } else {
        message.error(data.message || "Failed to fetch admins");
      }
    } catch (error) {
      console.error("Fetch admins error:", error);
      message.error("Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/delete/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        message.success("Admin deleted successfully!");
        fetchAdmins();
      } else {
        message.error(data.message || "Failed to delete admin");
      }
    } catch (error) {
      console.error("Delete admin error:", error);
      message.error("Failed to delete admin");
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f0f2f5",
        marginTop: "2px",
      }}
    >
      <Card
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <TeamOutlined style={{ marginRight: 9, color: "black", fontSize: "25px" }} />
            <span style={{ fontSize: "20px" }}>Manage Admins</span>
          </div>
        }
        style={{
          width: 650,
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          borderRadius: 0,
        }}
      >
        <Table
          columns={columns}
          dataSource={admins}
          loading={loading}
          rowKey="_id"
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default ManageAdmin;
