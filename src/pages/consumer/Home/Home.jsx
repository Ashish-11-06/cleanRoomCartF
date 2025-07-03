import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Row, Col, Carousel } from "antd";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { BASE_URL } from "../../../API/BaseURL";
import { motion } from "framer-motion";
import { FaHandSparkles, FaTools, FaDollarSign, FaHeadset } from 'react-icons/fa';

// Import images for carousel
import two from "../../../assets/car1.jpg";
import three from "../../../assets/car3.jpeg";
import four from "../../../assets/car4.webp";

const images = [two, three, four];
const { Meta } = Card;

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [ads, setAds] = useState([]); // State to store advertisements
  const BASE_URL2 = `${BASE_URL}/uploads/`; // API Base URL
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Fetch Categories
    axios
      .get(`${BASE_URL}/api/category/get`)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => console.error("Error fetching categories:", error));

    // Fetch Featured Products
    axios
      .get(`${BASE_URL}/api/interested-users/top-7-products`)
      .then((response) => {
        setFeaturedProducts(response.data.products);
      })
      .catch((error) =>
        console.error("Error fetching top interested products:", error)
      );

    // Fetch Advertisements
    axios
      .get(`${BASE_URL}/api/advertise`)
      .then((response) => {
        setAds(response.data);
      })
      .catch((error) => console.error("Error fetching advertisements:", error));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [ads.length]);

  const handleCategoryClick = (category) => {
    navigate(`/category/${category._id}`);
  };

  return (
    <div>
      {/* Carousel Section */}
      <div className="home-container">
        <Carousel autoplay autoplaySpeed={1000} dots infinite effect="scrollx">
          {images.map((img, index) => (
            <div key={index} className="carousel-slide">
              <img
                src={img}
                alt={`Slide ${index + 1}`}
                className="carousel-image"
              />
            </div>
          ))}
        </Carousel>
      </div>




      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', margin: '20px 0' }}>
        <div style={{ textAlign: 'center', maxWidth: '200px' }}>
          <FaHandSparkles style={{ fontSize: '50px', color: '#4CAF50' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginTop: '10px' }}>Durable Products</h3>
          <p style={{ fontSize: '14px', color: '#555', marginTop: '5px' }}>
            Our products feature durable and easy-to-maintain designs, ensuring cleanliness with minimal effort.
          </p>
        </div>
        <div style={{ textAlign: 'center', maxWidth: '200px' }}>
          <FaTools style={{ fontSize: '50px', color: '#2196F3' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginTop: '10px' }}>Superior Standard</h3>
          <p style={{ fontSize: '14px', color: '#555', marginTop: '5px' }}>
            Built with attention to detail and top-quality materials, our products are designed to exceed expectations.
          </p>
        </div>
        <div style={{ textAlign: 'center', maxWidth: '200px' }}>
          <FaDollarSign style={{ fontSize: '50px', color: '#FF9800' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginTop: '10px' }}>Great Value</h3>
          <p style={{ fontSize: '14px', color: '#555', marginTop: '5px' }}>
            Designed to save both time and money, our products are easy to maintain and built to last longer.
          </p>
        </div>
        <div style={{ textAlign: 'center', maxWidth: '200px' }}>
          <FaHeadset style={{ fontSize: '50px', color: '#9C27B0' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginTop: '10px' }}>Excellent Service</h3>
          <p style={{ fontSize: '14px', color: '#555', marginTop: '5px' }}>
            We provide expert advice, dependable delivery, and a dedicated team ready to assist you.
          </p>
        </div>
      </div>





      {/* Advertisement Section */}
      {ads.length > 0 && (
        <div
          style={{
            position: "relative",
            width: "100%",
            overflow: "hidden",
            height: "300px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              display: "flex",
              width: `${ads.length * 100}%`,
              transform: `translateX(-${currentIndex * (100 / ads.length)}%)`,
              transition: "transform 0.6s ease-in-out",
            }}
          >
            {ads.map((ad) => (
              <div
                key={ad._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  height: "300px",
                  width: `${100 / ads.length}%`,
                  background: "#fff",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                {/* Image Section - 60% */}
                <div
                  style={{
                    width: "60%",
                    height: "100%",
                    overflow: "hidden",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={
                      ad.bannerImage ? `${BASE_URL2}${ad.bannerImage}` : "/default.jpg"
                    }
                    alt="Ad"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "scale-down", // Changed from contain to scale-down
                    }}
                  />
                </div>


                {/* Text Section - 40% */}
                <div
                  style={{
                    width: "40%",
                    padding: "15px 20px",
                    backgroundColor: "#fafafa",
                    border: "0.5px solid rgba(0, 0, 0, 0.2)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {ad.productName && (
                    <h3
                      style={{
                        color: "#333",
                        fontSize: "22px",
                        marginBottom: "10px",
                        animation: "floatProductName 3s ease-in-out infinite",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      📢 {ad.productName}
                    </h3>
                  )}
                  {ad.message && (
                    <p
                      style={{
                        color: "#666",
                        marginBottom: "8px",
                        fontSize: "14px",
                        lineHeight: "1.4",
                      }}
                    >
                      📰 {ad.message?.split(" ").slice(0, 16).join(" ")}...
                    </p>
                  )}

                  {ad.discountPercentage && (
                    <div
                      style={{
                        perspective: "1000px",
                        display: "inline-block",
                        width: "auto",
                        height: "40px",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          textAlign: "center",
                          transition: "transform 0.6s",
                          transformStyle: "preserve-3d",
                          position: "relative",
                          animation: "flipCard 3s infinite",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            backfaceVisibility: "hidden",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#e74c3c",
                            fontWeight: "bold",
                            fontSize: "23px",
                          }}
                        >
                          💸 Discount: {ad.discountPercentage}%
                        </div>
                        <div
                          style={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            backfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#2ecc71",
                            fontWeight: "bold",
                            fontSize: "23px",
                          }}
                        >
                          🎉 Save Big!
                        </div>
                      </div>

                      {/* Flip animation keyframes inline */}
                      <style>
                        {`
            @keyframes flipCard {
                0% { transform: rotateY(0deg); }
                50% { transform: rotateY(180deg); }
                100% { transform: rotateY(360deg); }
            }
        `}
                      </style>
                    </div>
                  )}
                  {ad.startDate && ad.endDate && (
                    <p style={{ fontSize: "16px", color: "#000", textAlign: "center" }}>
                      🗓️ {new Date(ad.startDate).toLocaleDateString()} -{" "}
                      {new Date(ad.endDate).toLocaleDateString()}
                    </p>
                  )}
                </div>


              </div>
            ))}
          </div>

          {/* Animation keyframes */}
          <style>
            {`
        @keyframes floatProductName {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}
          </style>
        </div>
      )}

      {/* Categories Section */}
      <div style={{ padding: "15px" }}>
        <Row gutter={[16, 16]}>
          {categories.length > 0 ? (
            categories.map((category) => (
              <Col
                xs={24}
                sm={12}
                md={8}
                lg={6}
                key={category._id}
                style={{ paddingTop: "30px" }}
              >
                <div
                  style={{
                    display: "inline-block",
                    width: "200px",
                    margin: "10px",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => handleCategoryClick(category)}
                >
                  <div
                    style={{
                      width: "235px",
                      height: "240px",
                      overflow: "hidden",
                      border: "1px solid #ddd",
                      transition: "all 0.3s ease",
                      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.border = "1px solid black";
                      e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.2)";
                      e.currentTarget.style.transform = "translateY(-5px)"; // 👈 Floating effect applied here
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.border = "1px solid #ddd";
                      e.currentTarget.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.1)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <img
                      alt={category.name}
                      src={category.image ? `${BASE_URL2}${category.image}` : "/default.jpg"}
                      onError={(e) => {
                        e.target.src = "/default.jpg";
                      }}
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      marginTop: "8px",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    {category.name}
                  </div>
                </div>
              </Col>
            ))
          ) : (
            <p>No Categories Available</p>
          )}
        </Row>
      </div>


      {/* Featured Products Section */}
      <div
        style={{
          padding: "30px",
          textAlign: "center",
          backgroundColor: "#f8f8f8",
        }}
      >
        <h2 className="featured-title">Featured Products</h2>
        <Carousel
          autoplay
          autoplaySpeed={2000}
          dots={false}
          slidesToShow={Math.min(4, featuredProducts.length)}
          slidesToScroll={1}
          infinite
          speed={600}
          cssEase="ease-in-out"
        >
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <div
                key={product._id}
                className="product-card"
                onClick={() => navigate(`/product/${product._id}`)}
                style={{ cursor: "pointer" }}
              >
                <Card
                  hoverable
                  className="featured-product-card"
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                  cover={
                    <img
                      alt={product.productName || "Product"}
                      src={
                        product.image
                          ? `${BASE_URL}/uploads/${product.image.replace(
                            "/uploads/",
                            ""
                          )}`
                          : "/default.jpg"
                      }
                      onError={(e) => (e.target.src = "/default.jpg")}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "contain",
                        padding: "10px",
                        backgroundColor: "white",
                      }}
                    />
                  }
                >
                  <Meta
                    title={product.productName}
                    description={`Price: ₹${product.price || "N/A"}`}
                  />
                  <p className="product-description">
                    {(product.description || "No description available.")
                      .split(" ")
                      .slice(0, 25)
                      .join(" ") + "..."}
                  </p>
                </Card>
              </div>
            ))
          ) : (
            <p>No featured products found.</p>
          )}
        </Carousel>
      </div>




    </div>
  );
};

export default Home;
