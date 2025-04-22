import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Footer.css"; // Import the CSS file
import logo from '../../assets/logo.png';
import { BASE_URL } from "../../API/BaseURL";

const Footer = () => {
  const navigate = useNavigate(); // Initialize navigate
  const [categories, setCategories] = useState([]);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/category/get`);
        const data = await response.json();
        if (data && Array.isArray(data)) {
          setCategories(data.slice(0, 5)); // Fetch first 5 categories
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <footer className="footer">
      <img style={{ width: '150px', height: '80px', marginLeft: '-853px', marginTop: '0px' }} src={logo} alt="logo" />
      <div className="footer-container">
        <div className="footer-section">
          <h6>Cleanroom Cart</h6>
          <hr />
          <p>
            Address: A-302, Binawat Majestic,<br /> Sasane Nagar Rd., <br />Haveli, Hadapsar,<br /> Pune-411028, Maharashtra <br />
            Email: <a href="mailto:info@cleanroomcart.com">info@cleanroomcart.com</a>
          </p>
        </div>

        <div className="footer-section">
          <h6>Quick Links</h6>
          <hr />
          <ul>
            <li><a href="/login">User Login</a></li>
            <li><a href='/contact_form'>Contact Us</a></li>
            <li><a href="/">Home</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h6>Categories</h6>
          <hr />
          <ul>
            {categories.length > 0 ? (
              categories.map((category) => (
                <li key={category._id}>
                  <a href="#" onClick={() => navigate(`/category/${category._id}`)}>
                    {category.name}
                  </a>
                </li>
              ))
            ) : (
              <li>No categories available</li>
            )}
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {currentYear} Cleanroom Cart. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
