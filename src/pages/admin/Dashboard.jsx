import React, { useEffect, useState } from "react";
import { Card, Typography, Row, Col, Badge } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../API/BaseURL";
import { Link } from "react-router-dom";

const { Title } = Typography;

const Dashboard = () => {
  const navigate = useNavigate();
  const [queryCount, setQueryCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [newQueries, setNewQueries] = useState(0);
  const [newUsers, setNewUsers] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);

  // New states for interested users insights
  const [mostFrequentUser, setMostFrequentUser] = useState(null);
  const [mostInterestedProduct, setMostInterestedProduct] = useState(null);

  useEffect(() => {
    const prevQueryCount = parseInt(localStorage.getItem("queryCount") || "0", 10);
    const prevUserCount = parseInt(localStorage.getItem("userCount") || "0", 10);

    // Fetch Customer Queries Count
    const fetchQueryCount = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/contact/get`);
        setQueryCount(response.data.length);

        if (response.data.length > prevQueryCount) {
          setNewQueries(response.data.length - prevQueryCount);
        }
      } catch (error) {
        console.error("Error fetching query count:", error);
      }
    };

    // Fetch Users Count
    const fetchUserCount = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/consumer/list`);
        setUserCount(response.data.length);

        if (response.data.length > prevUserCount) {
          setNewUsers(response.data.length - prevUserCount);
        }
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };


    const fetchSubcategoryCount = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/subcategory/count`);
        setSubcategoryCount(response.data.count);
      } catch (error) {
        console.error("Error fetching subcategory count:", error);
      }
    };


    const fetchCategoryCount = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/category/get`);
        setCategoryCount(response.data.length); // ✅ Count from array length
      } catch (error) {
        console.error("Error fetching category count:", error);
      }
    };


    // Fetch Interested Users Data
    const fetchInterestedUsers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/admin/get/interested-users`);
        const interestedUsers = response.data;

        if (interestedUsers.length > 0) {
          const userCounts = {};
          const productCounts = {};

          interestedUsers.forEach((entry) => {
            // Count occurrences of users
            userCounts[entry.userName] = (userCounts[entry.userName] || 0) + 1;

            // Convert ObjectId to string for counting
            const productId = entry.productId.toString();
            productCounts[productId] = (productCounts[productId] || 0) + 1;
          });

          // Find most frequent user
          const topUser = Object.keys(userCounts).reduce((a, b) =>
            userCounts[a] > userCounts[b] ? a : b
          );

          // Find most interested product
          const topProduct = Object.keys(productCounts).reduce((a, b) =>
            productCounts[a] > productCounts[b] ? a : b
          );

          setMostFrequentUser({ name: topUser, count: userCounts[topUser] });
          setMostInterestedProduct({ id: topProduct, count: productCounts[topProduct] });
        }
      } catch (error) {
        console.error("Error fetching interested users:", error);
      }
    };

    fetchQueryCount();

    fetchUserCount();
    fetchInterestedUsers();
    fetchCategoryCount();
  }, []);

  // Function to navigate and reset new count
  const handleNavigate = (route, type) => {
    navigate(route);

    if (type === "query") {
      setNewQueries(0);
      localStorage.setItem("queryCount", queryCount);
    } else if (type === "user") {
      setNewUsers(0);
      localStorage.setItem("userCount", userCount);
    }
  };

  return (
    <div className="dashboard-container">
      <Row gutter={16}>
        {/* Total Customer Queries with Notification Badge */}


        <Col span={6}>
          <Card className="dashboard-card" hoverable>
            <Title level={4} className="card-title">Total Categories</Title>
            <Title level={2} className="category-count">{categoryCount}</Title>
          </Card>
        </Col>










        <Col span={6}>
          <Badge count={newQueries} offset={[10, 0]} style={{ backgroundColor: "#f5222d" }}>
            <Link to="/superadmin/inquiries" style={{ textDecoration: 'none' }}>
              <Card className="dashboard-card" hoverable>
                <Title level={4} className="card-title">Total Customer Queries</Title>
                <Title level={2} className="query-count">{queryCount}</Title>
              </Card>
            </Link>
          </Badge>
        </Col>

        <Col span={6}>
          <Badge count={newUsers} offset={[10, 0]} style={{ backgroundColor: "#52c41a" }}>
            <Link to="/superadmin/users" style={{ textDecoration: 'none' }}>
              <Card className="dashboard-card" hoverable>
                <Title level={4} className="card-title">Total Registered Users</Title>
                <Title level={2} className="user-count">{userCount}</Title>
              </Card>
            </Link>
          </Badge>
        </Col>


        {/* Total Categories */}





        {/* Most Frequent User */}
        {/* {mostFrequentUser && (
          <Col span={12}>
            <Card className="dashboard-card" hoverable>
              <Title level={4} className="card-title">Most Frequent User</Title>
              <Title level={3} className="user-name">{mostFrequentUser.name}</Title>
              <p>Marked {mostFrequentUser.count} products as interested</p>
            </Card>
          </Col>
        )} */}

        {/* Most Interested Product
        {mostInterestedProduct && (
          <Col span={12}>
            <Card className="dashboard-card" hoverable>
              <Title level={4} className="card-title">Most Interested Product</Title>
              <Title level={3} className="product-id">Product ID: {mostInterestedProduct.id}</Title>
              <p>Marked by {mostInterestedProduct.count} users</p>
            </Card>
          </Col>
        )} */}
      </Row>
    </div>
  );
};

export default Dashboard;
