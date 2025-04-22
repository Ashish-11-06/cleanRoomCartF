import React from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AntdLayout from "./component/Layout/Layout"; // ✅ Consumer Layout
import Home from "./pages/consumer/Home/Home";
import CartPage from "./pages/consumer/Carts";
import ContactForm from "./component/Contact_Form/Contact_Form";
import ProductList from "./component/ProductList/ProductList";
import Category from "./component/Category/Category";
import Product from "./component/Product/Product";
import AdminLogin from "./pages/admin/auth/AdminLogin";
import AdminSignup from "./pages/admin/AdminSignup";
import MainLayout from "./component/MainLayout/MainLayout"; 
import MainLayout1 from "./component/MainLayout/MainLayout1";// ✅ Admin Layout.
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Orders from "./pages/admin/Orders";
import InterestedUsers from "./pages/admin/InterestedUsers";
// import Login from "./pages/consumer/Login/login";
// import Signup from "./pages/consumer/Signup/signup";
import AddCategory from "./pages/admin/AddCategory";
import AddSubcategory from "./pages/admin/AddSubcategory";
import AddProduct from "./pages/admin/AddProduct";
import Inquiry from "./pages/admin/Inquiry";
import SubcategoryPage from "./component/SubcategoryPage/SubcategoryPage";
import Login from "./pages/consumer/Login/login";
import Signup from "./pages/consumer/Signup/signup";
import Subproduct from "./pages/admin/Subproduct";
import ForgotPassword from "./component/ForgotPassword/ForgotPassword";
import ResetPassword from "./component/ResetPassword/ResetPassword";
import Account from "./component/account/Account";
import AccountSettings from "./component/account/AccountSettings";
import AddAddress from "./component/account/AddAddress";
import AddPaymentMethod from "./component/account/AddPaymentMethod";
import Checkout from "./component/Checkout/Checkout";
import OrderHistory from "./component/account/OrderHistory";
import Messages from "./component/account/Messages";
import RecentlyViewed from "./component/account/RecentlyViewed";
import Advertise from "./pages/admin/Advertise";
import QuoteForm from "./component/Quote/QuoteForm";



 // ✅ Import the Subproduct Page

// Authentication Protection
const ProtectedRoute = ({ children, role }) => {
  const adminToken = localStorage.getItem("adminToken");
  const userToken = localStorage.getItem("userToken");
  const currentRole = localStorage.getItem("role");

  if (role === "consumer" && (!userToken || currentRole !== "consumer")) {
    return <Navigate to="/login" replace />;
  }

  if (role === "admin" && (!adminToken || currentRole !== "admin")) {
    return <Navigate to="/admin/login" replace />;
  }

  if (role === "superadmin" && (!adminToken || currentRole !== "superadmin")) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

const PublicRoute = ({ children, role }) => {
  const adminToken = localStorage.getItem("adminToken");
  const userToken = localStorage.getItem("userToken");
  const currentRole = localStorage.getItem("role");

  if (role === "admin" && adminToken && currentRole === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (role === "superadmin" && adminToken && currentRole === "superadmin") {
    return <Navigate to="/superadmin/dashboard" replace />;
  }

  if (role === "consumer" && userToken && currentRole === "consumer") {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* ✅ Consumer Login & Signup (Without AntdLayout) */}
        {/* <Route path="/login" element={<PublicRoute role="consumer"><Login /></PublicRoute>} /> */}
        {/* <Route path="/login" element={<Login/>} /> */}

        {/* ✅ Admin Login & Signup (Without MainLayout) */}
        <Route path="/admin/login" element={<PublicRoute role="admin"><AdminLogin /></PublicRoute>} />


        {/* ✅ Consumer Protected Routes (Inside AntdLayout) */}
        {/* <Route element={<ProtectedRoute role="consumer"><AntdLayout /></ProtectedRoute>}> */}
        <Route element={<AntdLayout />}>
          <Route path="/" element={<Home />} /> 
          <Route path="/category/:id" element={<Category />} />
          <Route path="/subcategory/:id" element={<SubcategoryPage />} /> 
          <Route path="/product/:id" element={<Product />} />
          <Route path="/contact_form" element={<ContactForm />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/quote" element={<QuoteForm/>} />



          <Route path="/account" element={<Account />}>
                    <Route path="account-settings" element={<AccountSettings />} />
                    <Route path="addresses" element={<AddAddress />} />
                    <Route path="payment-methods" element={<AddPaymentMethod />} />
                    <Route path="cart" element={<CartPage />} />
                    <Route path="orderHistory" element={<OrderHistory />} />
                    <Route path="messages" element={<Messages />} />
                    <Route path="recently-viewed" element={<RecentlyViewed />} />


                </Route>

          <Route path="/signup" element={<Signup />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />}/>
          {/* <Route path="/signup" element={<Signup/>}/> */}
          {/* ✅ Catch-All Route for Consumer Inside AntdLayout */}
          {/* <Route path="*" element={<Navigate to="/login" />} /> */}
        </Route>
        <Route element={<ProtectedRoute ><AntdLayout /></ProtectedRoute>}>
          <Route path="/cart" element={<CartPage />} />
        </Route>

        <Route path="/checkout" element={<Checkout />} />

          
          {/* <Route path="/category/:categoryName/:subcategory" element={<ProductList />} /> */}
          
          
          

        {/* ✅ Admin Protected Routes (Inside MainLayout) */}
         {/* Admin Routes */}
         <Route element={<ProtectedRoute role="admin"><MainLayout1 /></ProtectedRoute>}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/category" element={<AddCategory />} />
          <Route path="/admin/subcategory" element={<AddSubcategory />} />
          <Route path="/admin/product" element={<AddProduct />} />
          <Route path="/admin/orders" element={<Orders />} />
          <Route path="/admin/subproduct" element={<Subproduct />} />
        </Route>

        {/* Superadmin Routes */}
        <Route element={<ProtectedRoute role="superadmin"><MainLayout /></ProtectedRoute>}>
          <Route path="/superadmin/dashboard" element={<Dashboard />} />
          <Route path="/superadmin/users" element={<Users />} />
          <Route path="/superadmin/category" element={<AddCategory />} />
          <Route path="/superadmin/subcategory" element={<AddSubcategory />} />
          <Route path="/superadmin/product" element={<AddProduct />} />
          <Route path="/superadmin/orders" element={<Orders />} />
          <Route path="/superadmin/interested" element={<InterestedUsers />} />
          <Route path="/superadmin/inquiries" element={<Inquiry />} />
          <Route path="/superadmin/subproduct" element={<Subproduct />} />
          <Route path="/superadmin/advertise" element={<Advertise />} />
          <Route path="superadmin/addadmin" element={<AdminSignup />} />
          </Route>
      </Routes>
    </Router>
  );
};

export default App;
