// CartContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../API/BaseURL";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const fetchCartItems = async () => {
    try {
      if (!user) return;

      const response = await axios.get(`${BASE_URL}/api/cart/get/${userId}`);
      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [user, userId]);

  const addToCart = async (item) => {
    try {
      await axios.post(`${BASE_URL}/api/cart/add`, item);
      fetchCartItems(); // Refresh cart after adding
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleQuantityChange = async (value, record) => {
    try {
      await axios.put(
        `${BASE_URL}/api/cart/update/${userId}/${record.productId}`,
        { quantity: value }
      );
      fetchCartItems(); // Refresh cart after quantity update
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleRemoveItem = async (record) => {
    try {
  
      // 🔁 Start interested-user deletion in background (non-blocking)
      (async () => {
        try {
          const fullCode = record.productCode;
  
          const trimmedCode = fullCode.split('-')[0];
  
          const res = await axios.get(`${BASE_URL}/api/product/get-id-by-code/${trimmedCode}`);
  
          const productId = res.data?.productId;
          if (productId) {
            const deleteRes = await axios.delete(`${BASE_URL}/api/interested-users/delete-by-product/${productId}`);
          } else {
            console.warn("⚠️ Product ID not found for code:", trimmedCode);
          }
        } catch (err) {
          console.error("❌ Error during InterestedUser deletion flow:", err);
        }
      })();
  
      // ✅ Original cart item removal (unmodified)
      await axios.delete(`${BASE_URL}/api/cart/remove/${userId}?productCode=${record.productCode}`);
  
      fetchCartItems(); // Refresh cart after removing
    } catch (error) {
      console.error("❌ Error removing item from cart:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        handleQuantityChange,
        handleRemoveItem,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
