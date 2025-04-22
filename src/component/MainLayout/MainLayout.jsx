import React from "react";
import { Layout, Menu, Button, Space } from "antd";
import {
  HomeOutlined,
  AppstoreOutlined,
  FolderOpenOutlined,
  ShoppingOutlined,
  ThunderboltOutlined,
  MessageOutlined,
  UserAddOutlined,
  QuestionCircleOutlined,
  StarOutlined,
  ShoppingCartOutlined,
  LogoutOutlined,
  LoginOutlined,
  TagOutlined
} from "@ant-design/icons";
import { useNavigate, Outlet, useLocation } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = localStorage.getItem("adminToken");

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const menuItems = [
    {
      key: "/superadmin/dashboard",
      icon: <HomeOutlined />,
      label: "Dashboard",
      onClick: () => navigate("/superadmin/dashboard"),
    },
    {
      key: "/superadmin/category",
      icon: <AppstoreOutlined />,
      label: "Category",
      onClick: () => navigate("/superadmin/category"),
    },
    {
      key: "/superadmin/subcategory",
      icon: <FolderOpenOutlined />,
      label: "Subcategories",
      onClick: () => navigate("/superadmin/subcategory"),
    },
    {
      key: "/superadmin/product",
      icon: <ShoppingOutlined />,
      label: "Product",
      onClick: () => navigate("/superadmin/product"),
    },
    {
      key: "/superadmin/subproduct",
      icon: <ThunderboltOutlined />,
      label: "Subproduct",
      onClick: () => navigate("/superadmin/subproduct"),
    },
    {
      key: "/superadmin/advertise",
      icon: <TagOutlined />,
      label: "Advertisement",
      onClick: () => navigate("/superadmin/advertise"),
    },
    {
      key: "/superadmin/addadmin",
      icon: <UserAddOutlined />,
      label: "Add Admin",
      onClick: () => navigate("/superadmin/addadmin"),
    },
    {
      key: "/superadmin/users",
      icon: <QuestionCircleOutlined />,
      label: "users",
      onClick: () => navigate("/superadmin/users"),
    },
    {
      key: "/superadmin/inquiries",
      icon: <QuestionCircleOutlined />,
      label: "Inquiries",
      onClick: () => navigate("/superadmin/inquiries"),
    },
    {
      key: "/superadmin/interested",
      icon: <StarOutlined />,
      label: "Interested Users",
      onClick: () => navigate("/superadmin/interested"),
    },
    {
      key: "/superadmin/orders",
      icon: <ShoppingCartOutlined />,
      label: "Orders",
      onClick: () => navigate("/superadmin/orders"),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        style={{
          position: "fixed",
          left: 0,
          height: "calc(100vh)",
          background: "#7C444F",
          paddingTop: "16px",
          width: 200,
        }}
      >
        <div
          style={{
            height: "50px",
            margin: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          Admin Panel
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{
            background: "#7C444F",
            color: "#FFFFFF",
          }}
        >
          {menuItems.map((item) => (
            <Menu.Item
              key={item.key}
              icon={item.icon}
              onClick={item.onClick}
              style={{
                color: "#FFFFFF",
                background:
                  location.pathname === item.key ? "#E16A54" : "transparent",
                fontWeight: location.pathname === item.key ? "bold" : "normal",
                fontSize: "16px", // Increased font size by 2px
              }}
            >
              {item.label}
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout style={{ marginLeft: 200 }}>
        <Header
          style={{
            position: "fixed",
            left: 200,
            right: 0,
            top: 0,
            padding: "0 16px",
            background: "#F39E60",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 1,
          }}
        >
          <div
            style={{
              color: "#7C444F",
              fontSize: "22px",
              fontWeight: "bold",
              padding: "5px 20px",
            }}
          >
            {isAuthenticated ? "Welcome, Admin" : "Please Login"}
          </div>
          <Space style={{ padding: "10px 20px", marginTop: "16px" }}>
            {isAuthenticated ? (
              <Button
                type="primary"
                danger
                icon={<LogoutOutlined />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            ) : (
              <Button
                type="primary"
                icon={<LoginOutlined />}
                onClick={handleLogin}
              >
                Login
              </Button>
            )}
          </Space>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            marginTop: 64,
            padding: "24px",
            background: "#fff",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
