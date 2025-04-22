import React, { useState, useEffect } from "react";
import { Modal, Row, Col, Spin, Empty, Card, List } from "antd";
import axios from "axios";
import { BASE_URL } from "../../API/BaseURL";
import { useNavigate } from "react-router-dom";

const SearchModal = ({ searchQuery, visible, onCancel }) => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState({});
    const navigate = useNavigate();

    const fetchResults = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/api/product/searchbar`, {
                params: { name: searchQuery },
            });

            if (response.data && response.data.products) {
                setResults(response.data.products);

                const uniqueCategoryIds = [
                    ...new Set(response.data.products.map((product) => product.category)),
                ];

                const categoryResponses = await Promise.all(
                    uniqueCategoryIds.map((id) =>
                        axios.get(`${BASE_URL}/api/category/${id}`).catch(() => null)
                    )
                );

                const categoryMap = {};
                categoryResponses.forEach((res, index) => {
                    if (res && res.data.category) {
                        categoryMap[uniqueCategoryIds[index]] = res.data.category.name;
                    }
                });

                setCategories(categoryMap);
            } else {
                setResults([]);
                setCategories({});
            }
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (visible && searchQuery) {
            fetchResults();
        } else {
            setResults([]);
            setCategories({});
        }
    }, [visible, searchQuery]);

    const handleCategoryClick = (categoryId) => {
        onCancel();
        navigate(`/category/${categoryId}`);
    };

    const handleProductClick = (productId) => {
        onCancel();
        navigate(`/product/${productId}`);
    };

   const handleOutsideClick = (e) => {
       if (e.target.classList.contains('ant-modal')) {
           onCancel();
       }
   };

   return (
       <Modal
           open={visible}
           footer={null}
           width={900}
           centered
           onCancel={onCancel}
           maskClosable={true}
           onMouseDown={handleOutsideClick}
       >
           {loading ? (
               <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
           ) : results.length === 0 ? (
               <Empty description="No products found" />
           ) : (
               <Row gutter={[16, 16]} style={{ height: "400px", overflowY: "auto" }}>
                   <Col xs={6} style={{ borderRight: "1px solid #ddd", paddingRight: "10px" }}>
                       <h4 style={{ marginBottom: "10px" }}>Categories</h4>
                       <List
                           size="small"
                           bordered
                           dataSource={Object.keys(categories)}
                           renderItem={(categoryId) => (
                               <List.Item
                                   style={{
                                       cursor: "pointer",
                                       backgroundColor: "#f9f9f9",
                                       transition: "all 0.3s",
                                   }}
                                   onClick={() => handleCategoryClick(categoryId)}
                                   onMouseEnter={(e) => (e.target.style.background = "#e0e0e0")}
                                   onMouseLeave={(e) => (e.target.style.background = "#f9f9f9")}
                               >
                                   {categories[categoryId] || "Unknown Category"}
                               </List.Item>
                           )}
                       />
                   </Col>

                   <Col xs={18}>
                       <Row gutter={[8, 8]}>
                           {results.map((product) => (
                               <Col key={product._id} xs={24} sm={12} md={8}>
                                   <Card
                                       hoverable
                                       onClick={() => handleProductClick(product._id)}
                                       size="small"
                                       style={{
                                           height: "200px",
                                           display: "flex",
                                           flexDirection: "column",
                                           textAlign: "center",
                                           padding: "5px",
                                       }}
                                   >
                                       <div
                                           style={{
                                               flex: "7",
                                               display: "flex",
                                               alignItems: "center",
                                               justifyContent: "center",
                                               overflow: "hidden",
                                               backgroundColor: "#f8f8f8",
                                           }}
                                       >
                                           <img
                                               alt={product.productName}
                                               src={product.image ? `${BASE_URL}${product.image}` : "/uploads/default-image.png"}
                                               style={{
                                                   width: "100%",
                                                   maxHeight: "100%",
                                                   objectFit: 'contain',
                                               }}
                                           />
                                       </div>
                                       <div style={{ flex:"3", padding:"8px"}}>
                                           <h4 style={{ fontSize:"14px", marginBottom:"5px"}}>{product.productName}</h4>
                                           
                                       </div>
                                   </Card>
                               </Col>
                           ))}
                       </Row>
                   </Col>
               </Row>
           )}
       </Modal>
   );
};

export default SearchModal;
