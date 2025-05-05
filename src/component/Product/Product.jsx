//Product Component
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Row,
    Col,
    Typography,
    Button,
    Radio,
    InputNumber,
    Image,
    Spin,
    Modal,
    message,
} from "antd";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import { BASE_URL } from "../../API/BaseURL";
import ReviewProduct from "./ReviewProduct"; // Import the new component

import "./Product.css";

const { Title, Text } = Typography;

const Product = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [subProducts, setSubProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFilters, setSelectedFilters] = useState({});
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState(null);
    const [filterError, setFilterError] = useState(false);
    const { addToCart } = useCart();
    const [hasOnlyPrice, setHasOnlyPrice] = useState(false);
    const [productCode, setProductCode] = useState('');


    const EXCLUDED_FIELDS = [
        "_id",
        "productId",
        "createdAt",
        "updatedAt",
        "__v",
        "name",
        "price", //Exclude price from filter options
    ];

    useEffect(() => {
        if (!id) {
            message.error("Product ID is missing!");
            return;
        }

        const fetchData = async () => {
            try {
                const [productRes, subProductsRes] = await Promise.all([
                    axios.get(`${BASE_URL}/api/product/get-by/${id}`),
                    axios.get(`${BASE_URL}/api/subproduct/product/${id}`),
                ]);

                setProduct(productRes.data.product);
                setSubProducts(subProductsRes.data);

                if (subProductsRes.data.length > 0) {
                    const firstSubproductKeys = Object.keys(subProductsRes.data[0]);
                    const onlyPrice =
                        firstSubproductKeys.length === 4 &&
                        firstSubproductKeys.includes("price");
                    setHasOnlyPrice(onlyPrice);
                } else {
                    setHasOnlyPrice(false);
                }
            } catch (error) {
                message.error("Failed to load product details.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        const findMatchingSubproduct = () => {
            if (Object.keys(selectedFilters).length === 0) {
                setPrice(null);
                setFilterError(false);
                return;
            }

            const matchingSub = subProducts.find((sub) => {
                return Object.keys(selectedFilters).every(
                    (key) => sub[key] === selectedFilters[key]
                );
            });

            if (matchingSub) {
                setPrice(matchingSub.price);
                setFilterError(false);
            } else {
                setPrice(null);
                setFilterError(Object.keys(selectedFilters).length > 0);
            }
        };

        findMatchingSubproduct();
    }, [selectedFilters, subProducts]);

    useEffect(() => {
        setProductCode(buildProductCode());
    }, [selectedFilters, product]);


    const getAvailableFilters = () => {
        const filters = {};
        subProducts.forEach((sub) => {
            Object.keys(sub).forEach((key) => {
                if (!EXCLUDED_FIELDS.includes(key) && sub[key]) {
                    filters[key] = filters[key] || new Set();
                    filters[key].add(sub[key]);
                }
            });
        });
        return filters;
    };

    const handleFilterChange = (filterKey, value) => {
        const newFilters = { ...selectedFilters };
        if (value) {
            newFilters[filterKey] = value;
        } else {
            delete newFilters[filterKey];
        }
        setSelectedFilters(newFilters);
    };

    const buildProductCode = () => {
        if (!product) return "";

        const filterOrder = ["size", "color", "height", "width"];
        const filterParts = filterOrder
            .map((key) => selectedFilters[key] || "")
            .filter((value) => value !== "")
            .join("-");

        return `${product.productCode}${filterParts ? `-${filterParts}` : ""}`;
    };

    const handleCartClick = async () => {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) {
            Modal.confirm({
                title: "Login Required",
                content: "Please log in to continue.",
                okText: "Login",
                cancelText: "Cancel",
                onOk: () => navigate("/login"),
                okButtonProps: {
                    style: {
                        backgroundColor: "#40476D",
                        color: "#fff",
                        border: "none",
                    },
                },
                cancelButtonProps: {
                    style: {
                        backgroundColor: "#40476D",
                        color: "#fff",
                        border: "none",
                    },
                },
            });
            return;
        }

        try {
            let finalPrice = product.price;

            if (price) {
                finalPrice = price * quantity;
            }

            const cartItem = {
                key: `${product._id}-${productCode}`,
                name: product.productName,
                price: finalPrice,
                filters: selectedFilters,
                quantity,
                userId: user._id,
                productCode: productCode, // Include the generated product code
            };

            // Check if the product is already in the cart
            const existingCartItem = await axios.get(`${BASE_URL}/api/cart/get/${user._id}`)
                .then(response => response.data.find(item => item.productId === product._id))
                .catch(() => null);

            if (existingCartItem) {
                Modal.confirm({
                    title: "Product Already Marked",
                    content: "You have already marked this product. Do you want to add another one to your cart?",
                    okText: "Yes, Add Another",
                    cancelText: "No, Just Keep Marked",
                    okButtonProps: {
                        style: {
                            backgroundColor: "#40476D",
                            color: "#fff",
                            borderColor: "#40476D"
                        }
                    },
                    cancelButtonProps: {
                        style: {
                            backgroundColor: "#40476D",
                            color: "#fff",
                            borderColor: "#40476D"
                        }
                    },
                    onOk: async () => {
                        try {
                            await axios.post(`${BASE_URL}/api/cart/add`, {
                                userId: user._id,
                                productId: product._id,
                                name: product.productName,
                                image: product.image,
                                price: finalPrice,
                                quantity,
                                size: selectedFilters.size || null,
                                color: selectedFilters.color || null,
                                height: selectedFilters.height || null,
                                width: selectedFilters.width || null,
                                productCode: productCode, // Include the generated product code
                            });

                            addToCart(cartItem);
                            message.success("Another item added to cart!");
                        } catch (error) {
                            message.error("Failed to add item to cart.");
                        }
                    },
                    onCancel: () => {
                        // Do nothing if the user cancels
                    },
                });
            } else {
                // If the product is not in the cart, add it directly
                try {
                    await axios.post(`${BASE_URL}/api/interested-users/add`, {
                        userName: `${user.firstName} ${user.lastName}`.trim() || "unknown User",
                        email: user.email,
                        phone: user.phone || "Not Provided",
                        productId: product._id
                    });

                    await axios.post(`${BASE_URL}/api/cart/add`, {
                        userId: user._id,
                        productId: product._id,
                        name: product.productName,
                        image: product.image,
                        price: finalPrice,
                        quantity,
                        size: selectedFilters.size || null,
                        color: selectedFilters.color || null,
                        height: selectedFilters.height || null,
                        width: selectedFilters.width || null,
                        productCode: productCode, // Include the generated product code
                    });

                    addToCart(cartItem);
                    message.success("Item added to cart!");

                } catch (error) {
                    message.error("Failed to add item to cart.");
                }
            }
        } catch (error) {
            message.error("An error occurred.");
        }
    };

    if (loading)
        return <Spin size="large" style={{ display: "block", margin: "20px auto" }} />;
    if (!product)
        return (
            <h2 style={{ color: "red", textAlign: "center" }}>
                ⚠ Product Not Found
            </h2>
        );

    const availableFilters = getAvailableFilters();
    const hasFilters = Object.keys(availableFilters).length > 0;

    const showFilterMessage = hasOnlyPrice;

    return (
        <div>
            <div
                style={{ padding: "20px", backgroundColor: "white", marginRight: "20px" }}
            >
                <Row gutter={24}>
                    <Col span={12}>
                        <Image
                            src={`${BASE_URL}/uploads/${product.image.replace(
                                "/uploads/",
                                ""
                            )}`}
                            alt={product.productName}
                            style={{ maxWidth: "100%", borderRadius: "0px" }}
                            onError={(e) => {
                                e.target.src = "/placeholder-image.png";
                            }}
                        />
                    </Col>
                    <Col span={12}>
                        <Title level={3}>{product.productName}</Title>
                        {price ? (
                            <Title level={4}>₹{price}</Title>
                        ) : filterError ? (
                            <Text type="danger">Selected combination not available</Text>
                        ) : showFilterMessage ? (
                            <Text>This product has only one option available</Text>
                        ) : (
                            <Title level={4}>₹{product.price}</Title>
                        )}

                        {/* Review Product Component */}
                        <ReviewProduct productId={id} />
                        <Text>
                            Product Code: <strong>{productCode}</strong>
                        </Text>
                        <br />
                        <br />

                        {hasFilters &&
                            !hasOnlyPrice &&
                            Object.keys(availableFilters).map((filterKey) => (
                                <div key={filterKey}>
                                    <Text>
                                        {filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}:
                                    </Text>
                                    <div>
                                        <Radio.Group
                                            onChange={(e) =>
                                                handleFilterChange(filterKey, e.target.value)
                                            }
                                            value={selectedFilters[filterKey]}
                                        >
                                            {Array.from(availableFilters[filterKey]).map((value) => (
                                                <Radio.Button
                                                    key={value}
                                                    value={value}
                                                    style={
                                                        filterKey === "color"
                                                            ? {
                                                                backgroundColor: value,
                                                                color: "white",
                                                                borderRadius: "50%",
                                                                marginRight: "4px",
                                                            }
                                                            : { marginRight: "4px" }
                                                    }
                                                >
                                                    {filterKey === "color" ? "" : value}
                                                </Radio.Button>
                                            ))}
                                        </Radio.Group>
                                    </div>
                                </div>
                            ))}
                        <div style={{ marginTop: "20px" }}>
                            <Text>Quantity:</Text>
                            <InputNumber
                                min={1}
                                defaultValue={1}
                                value={quantity}
                                onChange={(value) => setQuantity(value)}
                                style={{ marginLeft: "10px" }}
                            />
                        </div>

                        <Button
                            type="primary"
                            style={{
                                marginTop: "20px",
                                backgroundColor: "#40476D",
                                border: "none",
                                color: "#FFFFFF",         // White text
                                borderRadius: "0px",      // Sharp edges
                                width: "150px"            // Fixed width
                            }}
                            onClick={handleCartClick}
                        >
                            Add to Cart
                        </Button>

                    </Col>
                </Row>
                <Row>
                    <Col span={24} style={{ marginTop: "20px",fontSize: "18px" }}>
                        <div dangerouslySetInnerHTML={{ __html: product.description }} />
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Product;
