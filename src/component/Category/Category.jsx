import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Row, Col } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DOMPurify from 'dompurify'; // For sanitizing HTML content

import { BASE_URL } from "../../API/BaseURL";

const Category = () => {
  const { id } = useParams(); // Get category ID from the URL
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subcategories, setSubcategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/category/${id}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.category) {
          setCategory(data.category);
        }
      } catch (error) {
        console.error("Error fetching category details:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchSubcategories = async () => {
      try {
        const subcategoriesResponse = await axios.get(`${BASE_URL}/api/subcategory/get/${id}`);
        setSubcategories(subcategoriesResponse.data.subcategories || []);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchCategoryDetails();
    fetchSubcategories();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!category) return <p>Category not found</p>;

  return (
    <div style={{ padding: "0px 20px 20px 20px" }}>
      <h2 style={{ paddingLeft: '25%' }}>{category?.name || "No Name Available"}</h2>
      
      {/* Short Description with Justified Text */}
      <p style={{ fontSize: '18px', textAlign: 'justify' }}>
        {category?.shortDescription || "No Description"}
      </p>

      {/* Subcategories Section */}
      <Row gutter={[16, 16]}>
        {subcategories.length > 0 ? (
          subcategories.map((subcategory) => (
            <Col style={{ paddingTop: '30px' }} xs={24} sm={12} md={8} lg={6} key={subcategory._id}>
              <div
                style={{
                  display: "inline-block",
                  width: "200px",
                  margin: "10px",
                  textAlign: "center",
                  cursor: "pointer"
                }}
                onClick={() => navigate(`/subcategory/${subcategory._id}`)}
              >
                <div
                  style={{
                    width: "235px",
                    height: "240px",
                    overflow: "hidden",
                    border: "1px solid #ddd",
                    transition: "border 0.3s ease" // Smooth border transition
                  }}
                  onMouseOver={(e) => (e.target.style.border = "1px solid black")} // Darker border on hover
                  onMouseOut={(e) => (e.target.style.border = "0.5px solid #ddd")} // Revert border on mouse out
                >
                  <img
                    alt={subcategory.name}
                    src={subcategory.image ? `${BASE_URL}/${subcategory.image.replace(/\\/g, "/")}` : "/default.jpg"}
                    onError={(e) => { e.target.src = "/default.jpg"; }}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block"
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
                  {subcategory.name}
                </div>
              </div>
            </Col>
          ))
        ) : (
          <p>No Subcategories Available</p>
        )}
      </Row>

      {/* Detailed Description with Justified Text and Reduced Line Spacing */}
      <h2 style={{ paddingTop: '20px', margin: '0' }}>Details</h2>
      <div
        style={{ fontSize: '18px', lineHeight: '1.5', textAlign: 'justify' }} // Reduced line spacing and justified text
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(category?.detailedDescription || "No Detailed Description"),
        }}
      />
    </div>
  );
};

export default Category;
