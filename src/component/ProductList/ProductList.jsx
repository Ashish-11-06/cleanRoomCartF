import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../API/BaseURL";

const ProductList = () => {
  const { subcategory } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/subcategory/${subcategory}/products/${products}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [subcategory]);

  return (
    <div style={{ padding: "24px" }}>
      <h2>
        Products in "{subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}"
      </h2>

      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p style={{ color: "red", fontWeight: "bold" }}>⚠ {error}</p>
      ) : products.length > 0 ? (
        <Row gutter={[16, 16]}>
          {products.map((product) => (
            <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
              <Card
                hoverable
                cover={<img alt={product.name} src={product.image} />}
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p>
                  <strong>₹{product.price}</strong>
                </p>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p style={{ color: "red", fontWeight: "bold" }}>
          ⚠ No products found for this subcategory.
        </p>
      )}
    </div>
  );
};

export default ProductList;


