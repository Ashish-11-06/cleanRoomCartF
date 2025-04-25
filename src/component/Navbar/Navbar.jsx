import React, { useState, useEffect, useRef } from "react";
import { Layout, message, Input } from "antd";
import { MailOutlined, PhoneOutlined, ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import "./Navbar.css";
import logo from "../../assets/logo.png";
import { BASE_URL } from "../../API/BaseURL";
import SearchModal from "./SearchModal";
import { SearchOutlined } from "@ant-design/icons";

const { Header } = Layout;

const Navbar = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");
    const { cartItems } = useCart();
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const searchInputRef = useRef(null);
    const [quoteBoxVisible, setQuoteBoxVisible] = useState(false);
    let quoteHideTimeout = null;

    useEffect(() => {
        fetch(`${BASE_URL}/api/category/get`)
            .then((response) => response.json())
            .then((data) => {
                if (data && Array.isArray(data)) {
                    setCategories(data.slice(0, 5));
                }
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
            });
    }, []);

    useEffect(() => {
        const handleStorageChange = () => {
            const token = localStorage.getItem("userToken");
            const storedUserName = localStorage.getItem("userName");
            setIsLoggedIn(!!token);
            if (storedUserName) {
                setUserName(storedUserName);
            }
        };

        handleStorageChange();
        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    const handleLogout = () => {
        try {
            localStorage.removeItem("userToken");
            localStorage.removeItem("user");
            localStorage.removeItem("cart");
            message.success("Logged out successfully");
            setIsLoggedIn(false);
            setUserName("");
            navigate("/login");
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    const user = JSON.parse(localStorage.getItem("user"));
    const name = user ? `${user.firstName} ${user.lastName}` : "Guest";

    const debounce = (func, delay) => {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    };

    const showModalIfNeeded = (value) => {
        if (value) {
            setShowModal(true);
        } else {
            setShowModal(false);
        }
    };

    const debouncedShowModalIfNeeded = debounce(showModalIfNeeded, 2000);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedShowModalIfNeeded(value);
    };

    const handleQuoteMouseEnter = () => {
        if (quoteHideTimeout) {
            clearTimeout(quoteHideTimeout);
        }
        setQuoteBoxVisible(true);
    };

    const handleQuoteMouseLeave = () => {
        quoteHideTimeout = setTimeout(() => {
            setQuoteBoxVisible(false);
        }, 2000);
    };

    return (
        <Layout className="navbar">
            {/* Top Header */}
            <Header className="navbar-top">
                <div className="navbar-contact">
                    <span style={{ marginRight: "40px" }}>Welcome, {name} !</span>
                    <Link style={{ textDecoration: "none", marginBottom: "10px" }} to="/contact_form">
                        <span>Contact Us</span>
                    </Link>
                    <span> | </span>
                    <span
                        style={{ position: "relative" }}
                        onMouseEnter={handleQuoteMouseEnter}
                        onMouseLeave={handleQuoteMouseLeave}
                    >
                        Quote
                        {quoteBoxVisible && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: "32px",
                                    left: "-40px",
                                    padding: "10px",
                                    background: "white",
                                    border: "1px solid #ccc",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                                    zIndex: 10,
                                    width: "140px",
                                    textAlign: "center",
                                }}
                            >
                                <Link to="/quote">
                                    <button
                                        style={{
                                            backgroundColor: "#40476D",
                                            color: "white",
                                            border: "none",
                                            padding: "8px 12px",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Get a quick quote
                                    </button>
                                </Link>
                            </div>
                        )}
                    </span>
                    <span> | </span>
                    {isLoggedIn ? (
                        <>
                            <Link style={{ textDecoration: "none" }} to="/account">
                                <UserOutlined style={{ marginRight: "5px" }} />
                                <span>Account</span>
                            </Link>
                            <span> | </span>
                            <span style={{ cursor: "pointer" }} onClick={handleLogout}>
                                Logout
                            </span>
                        </>
                    ) : (
                        <Link style={{ textDecoration: "none" }} to="/login">
                            <span>Login</span>
                        </Link>
                    )}
                    <span> | </span>
                    <Link style={{ textDecoration: "none", position: "relative" }} to="/cart">
                        <span style={{ marginLeft: "5px" }}>My Cart</span>
                        <ShoppingCartOutlined style={{ fontSize: "22px" }} />
                        {cartItems.length > 0 && (
                            <span
                                style={{
                                    position: "absolute",
                                    top: "-32px",
                                    right: "-3px",
                                    color: "red",
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                }}
                            >
                                {cartItems.length}
                            </span>
                        )}
                    </Link>
                </div>
            </Header>

            {/* Main Navbar */}
            <Header className="navbar-main" style={{ backgroundColor: "#f0f0f0", marginTop: "10px" }}>
                <Link to="/">
                    <img
                        style={{ width: "120px", cursor: "pointer", paddingTop: "18px", margin: "0px", marginRight: "20px" }}
                        src={logo}
                        alt="logo"
                    />
                </Link>

                <div style={{ display: "flex", alignItems: "center", marginRight: "20px" }}>
    <Input
        id="search-input"
        type="text"
        placeholder="#𝘴𝘦𝘢𝘳𝘤𝘩 𝘱𝘳𝘰𝘥𝘶𝘤𝘵𝘴 𝘩𝘦𝘳𝘦"
        value={searchTerm}
        onChange={handleSearchChange}
        style={{
            width: "450px", // Increased by 100px
            height: "40px",
            padding: "5px",
            color: "black",
        }}
        ref={searchInputRef}
        prefix={<SearchOutlined style={{ color: "#40476D", fontSize: 18 }} />}
    />
    <style>
        {`
          #search-input::placeholder {
            color: black;
            opacity: 1;
          }
        `}
    </style>
</div>

                <div className="navbar-questions">
                    <PhoneOutlined /> <span>Talk to Us ?  Call 123-456-7890 </span>
                    <a href="mailto:info@cleanroomworld.com" className="email-link">
                        <MailOutlined /> info@cleanroomcart.com
                    </a>
                </div>
            </Header>

            {/* Removed the Category Navigation Menu here */}

            {/* Search Modal */}
            <SearchModal
                searchQuery={searchTerm}
                visible={showModal}
                onCancel={() => setShowModal(false)}
                onOutsideClick={() => setShowModal(false)}
            />
        </Layout>
    );
};

export default Navbar;
