import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import { Layout } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import Category from "../Category/Category";
import Footer from "../Footer/Footer";

const { Sider, Content } = Layout;

const AntdLayout = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    console.log("Category clicked:", category);
    setSelectedCategory(category.title);
    navigate(`/category/${category._id}`); // Update the URL dynamically
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Navbar />
      <Layout>
        {/* Sidebar with click handler */}
        <Sider width={280} theme="light">
          <Sidebar onCategoryClick={handleCategoryClick} />
        </Sider>

        {/* Main content area */}
        <Content
          style={{
            marginLeft: "36px",
          }}
        >
          {/* Render the selected category */}
          <Outlet context={{ selectedCategory }} />
          {/* <Category selectedCategory={selectedCategory} /> */}
        </Content>

        {/* Pass selected category to Category component */}
        {/* <Category selectedCategory={selectedCategory} /> */}
      </Layout>
      <Footer/>
    </Layout>
  );
};

export default AntdLayout; 

