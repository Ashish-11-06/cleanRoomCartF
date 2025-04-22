import React from 'react';  // ✅ Import React
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { CartProvider } from './context/CartContext.jsx';
// import { AuthProvider } from './context/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    // <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
      // </AuthProvider>  
  // </React.StrictMode>
);
