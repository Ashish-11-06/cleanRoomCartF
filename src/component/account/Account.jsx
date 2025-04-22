import React, { useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

const Account = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Define menu items with paths
    const menuItems = [
        { name: "Orders", path: "/account/orderHistory" },
        { name: "Messages", path: "/account/messages" },
        { name: "Addresses", path: "/account/addresses" },
        { name: "Payment Methods", path: "/account/payment-methods" },
        { name: "Wish Lists", path: "/account/cart" },
        { name: "Recently Viewed", path: "/account/recently-viewed" },
        { name: "Account Settings", path: "/account/account-settings" }
    ];

    // Set "Orders" as active by default on initial load
    useEffect(() => {
        if (location.pathname === "/account") {
            navigate("/account/cart", { replace: true });
        }
    }, [location, navigate]);

    return (
        <div style={styles.container}>
            {/* Account Navbar */}
            <div style={styles.navbar}>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        style={({ isActive }) => ({
                            ...styles.navItem,
                            fontWeight: isActive ? "bold" : "normal",
                            borderBottom: isActive ? "2px solid black" : "none",
                            textDecoration: 'none', // Remove underline from NavLink
                            color: 'inherit' // Inherit text color from parent
                        })}
                    >
                        {item.name}
                    </NavLink>
                ))}
            </div>

            {/* Dynamic Content - Outlet will load the selected component */}
            <div style={styles.content}>
                <Outlet />
            </div>
        </div>
    );
};

// Inline styles
const styles = {
    container: {
        width: "80%",
        margin: "auto",
        fontFamily: "Arial, sans-serif"
    },
    navbar: {
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 0",
        borderBottom: "1px solid #ddd"
    },
    navItem: {
        cursor: "pointer",
        paddingBottom: "5px",
        color: "black", // Default color
    },
    content: {
        marginTop: "20px",
        padding: "20px",
        background: "#f9f9f9",
        borderRadius: "0" // Set border radius to 0 for sharp edges
    }
};

export default Account;
