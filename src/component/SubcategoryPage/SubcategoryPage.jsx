import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Spin, Row, Col, message, Select, Modal, Checkbox, Slider, Button } from "antd";
import { FilterOutlined } from '@ant-design/icons';
import axios from "axios";
import { BASE_URL } from "../../API/BaseURL";
import DOMPurify from "dompurify";

const { Option } = Select;
const { Meta } = Card;

const SubcategoryPage = () => {
    const { id } = useParams();
    const [subcategory, setSubcategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [sortedProducts, setSortedProducts] = useState([]);
    const [sortOption, setSortOption] = useState("price_asc");
    const [filters, setFilters] = useState({
        colors: [],
        sizes: [],
        prices: [],
        widths: [],
        heights: [],
    });
    const [selectedFilters, setSelectedFilters] = useState({
        colors: [],
        sizes: [],
        widths: [],
        heights: [],
    });
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const navigate = useNavigate();
    const [resultCount, setResultCount] = useState(0);

    // Fetch subcategory and products data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const subcategoryResponse = await axios.get(`${BASE_URL}/api/subcategory/${id}`);
                setSubcategory(subcategoryResponse.data.subcategory);

                const productsResponse = await axios.get(`${BASE_URL}/api/product/get/${id}`);
                const productData = productsResponse.data.products || [];
                setProducts(productData);
                setSortedProducts(productData);
                setResultCount(productData.length);  // Initial result count

                // Extract productIds
                const productIds = productData.map(product => product._id).join(',');

                // Fetch filters with productIds
                const filtersResponse = await axios.get(`${BASE_URL}/api/subproduct/filters?productIds=${productIds}`);
                setFilters(filtersResponse.data.filters);

            } catch (error) {
                message.error("Failed to load data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // Sort products
    useEffect(() => {
        const sortProducts = () => {
            if (!products.length) return;

            const sortedArray = [...products].sort((a, b) => {
                switch (sortOption) {
                    case "price_asc":
                        return a.price - b.price;
                    case "price_desc":
                        return b.price - a.price;
                    case "name_asc":
                        return a.productName.localeCompare(b.productName);
                    case "name_desc":
                        return b.productName.localeCompare(a.productName);
                    default:
                        return 0;
                }
            });
            setSortedProducts(sortedArray);
        };

        sortProducts();
    }, [products, sortOption]);

    const handleSortChange = (value) => {
        setSortOption(value);
    };

    const trimDescription = (desc) => {
        return desc ? `${desc.split(" ").slice(0, 10).join(" ")}...` : "No description available";
    };

    const getMinimumPrice = (subproducts) => {
        if (!subproducts || subproducts.length === 0) return "N/A";
        return Math.min(...subproducts.map((subproduct) => subproduct.price));
    };

    const applyFilters = async () => {
        try {
            setLoading(true); // Start loading before applying filters

            const filteredListResponse = await axios.post(`${BASE_URL}/api/subproduct/filtered/${id}`, {
                colors: selectedFilters.colors,
                sizes: selectedFilters.sizes,
                priceRange,
                widths: selectedFilters.widths,
                heights: selectedFilters.heights,
            });

            if (filteredListResponse.data.length > 0) {
                setSortedProducts(filteredListResponse.data);
                setResultCount(filteredListResponse.data.length); // Update result count
            } else {
                message.info("No products match your filters.");
                setSortedProducts([]);
                setResultCount(0); // Update result count
            }

            setIsFilterModalVisible(false);
        } catch (error) {
            message.error("Failed to apply filters.");
            console.error(error);
        } finally {
            setLoading(false); // Stop loading regardless of success or failure
        }
    };

    const resetFilters = () => {
        setSelectedFilters({
            colors: [],
            sizes: [],
            widths: [],
            heights: [],
        });
        setPriceRange([0, 1000]);
    };

    return (
        <div style={{ padding: "20px" }}>
            {loading ? (
                <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
            ) : !subcategory ? (
                <p style={{ textAlign: "center", fontSize: "18px", color: "red" }}>Subcategory not found</p>
            ) : (
                <>
                    <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
                        {subcategory.name || "No Name Available"}
                    </h2>
                    <p style={{ fontSize: "18px", textAlign: "center" }}>
                        {subcategory.shortDescription || "No Short Description Available"}
                    </p>

                    <p style={{
                        textAlign: 'center',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: 'gray',
                        marginBottom: '10px'
                    }}>
                        Showing {resultCount} results
                    </p>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                        <Select defaultValue="price_asc" style={{ width: 200 }} onChange={handleSortChange}>
                            <Option value="price_asc">Price: Low to High</Option>
                            <Option value="price_desc">Price: High to Low</Option>
                            <Option value="name_asc">Name: A-Z</Option>
                            <Option value="name_desc">Name: Z-A</Option>
                        </Select>
                        <FilterOutlined
                            onClick={() => setIsFilterModalVisible(true)}
                            style={{ fontSize: '24px', cursor: 'pointer' }}
                        />
                    </div>
                    {sortedProducts.length > 0 ? (
                        <Row gutter={[16, 16]}>
                            {sortedProducts.map((product) => (
                                <Col key={product._id} xs={24} sm={12} md={8} lg={6} style={{ paddingTop: "20px" }}>
                                    <Card
                                        hoverable
                                        style={{
                                            width: "100%",
                                            maxWidth: "250px",
                                            margin: "auto",
                                            borderRadius: "0px",
                                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                                        }}
                                        cover={
                                            product.image ? (
                                                <img
                                                    alt={product.productName}
                                                    src={`${BASE_URL}/uploads/${product.image.replace("/uploads/", "")}`}
                                                    style={{
                                                        width: "100%",
                                                        height: "180px",
                                                        objectFit: "contain",
                                                        borderRadius: "0px",
                                                        backgroundColor: "white",
                                                    }}
                                                />
                                            ) : (
                                                <div style={{
                                                    width: '100%',
                                                    height: '180px',
                                                    backgroundColor: '#f0f0f0',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    No Image Available
                                                </div>
                                            )
                                        }
                                        onClick={() => navigate(`/product/${product._id}`)}
                                    >
                                        <Meta
                                            title={<div style={{ fontWeight: 'bold', marginBottom: '3px', fontSize: '14px' }}>{product.productName}</div>}
                                            description={
                                                <div style={{ marginTop: '-5px' }}>
                                                    <p style={{
                                                        marginBottom: "1px",
                                                        fontSize: "14px",
                                                        color: "#333",
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between'
                                                    }}>
                                                        <span style={{ fontWeight: 'bold' }}>{product.productCode || "N/A"}</span>
                                                    </p>
                                                    <p style={{ marginBottom: "1px", fontSize: "14px", color: "#666" }}>
                                                        {trimDescription(product.description)}
                                                    </p>
                                                    <p style={{
                                                        fontSize: "14px",
                                                        color: "#191970",
                                                        marginBottom: 0,
                                                        fontWeight: 'bold'
                                                    }}>
                                                        <p style={{ margin: "1px", fontSize: "16px", fontWeight: "normal", color: "#333" }}>
                                                            Starting at <span style={{ fontWeight: "bold", color: "#2b2b83" }}>₹{product.price}</span>
                                                        </p>
                                                    </p>
                                                </div>
                                            }
                                        />
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <p style={{ textAlign: "center", fontSize: "18px", marginTop: "20px", color: "gray" }}>
                            No Products Available
                        </p>
                    )}
                    <h2 style={{ paddingTop: "20px", marginBottom: "5px" }}>Details</h2>
                    <div
                        style={{ fontSize: "18px" }}
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(subcategory.detailedDescription || "<p>No Detailed Description Available</p>"),
                        }}
                    ></div>
                    <Modal
                        title="Filter Products"
                        visible={isFilterModalVisible}
                        onOk={applyFilters}
                        onCancel={() => setIsFilterModalVisible(false)}
                        footer={[
                            <Button key="reset" onClick={() => {
                                resetFilters();
                            }}>
                                Reset
                            </Button>,
                            <Button key="cancel" onClick={() => setIsFilterModalVisible(false)}>
                                Cancel
                            </Button>,
                            <Button key="apply" type="primary" onClick={applyFilters} style={{borderRadius: '0px'}}>
                                Apply
                            </Button>,
                        ]}
                    >
                        {Object.keys(filters).map(key => (
                            <div key={key} style={{ marginBottom: '20px' }}>
                                <h4>{key.charAt(0).toUpperCase() + key.slice(1)}</h4>
                                {key === 'prices' ? (
                                    <>
                                        <Slider
                                            range
                                            min={0}
                                            max={1000}
                                            value={priceRange}
                                            onChange={setPriceRange}
                                        />
                                        <div>Selected Price Range : ₹{priceRange[0]} - ₹{priceRange[1]}</div>
                                    </>
                                ) : (
                                    <Checkbox.Group
                                        options={filters[key].map(filter => ({
                                            label: `${filter.value} (${filter.count})`,
                                            value: filter.value,
                                        }))}
                                        value={selectedFilters[key]}
                                        onChange={checkedValues =>
                                            setSelectedFilters(prev => ({ ...prev, [key]: checkedValues }))
                                        }
                                    />
                                )}
                            </div>
                        ))}
                    </Modal>
                </>
            )}
        </div>
    );
};

export default SubcategoryPage;
