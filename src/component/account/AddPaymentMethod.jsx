import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddPaymentMethod.css";
import { BASE_URL } from "../../API/BaseURL";

const AddPaymentMethod = () => {
    const [countries, setCountries] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [formData, setFormData] = useState({
        cardNumber: "",
        cvv: "",
        expiry: "",
        cardholderName: "",
        billingAddress: {
            firstName: "",
            lastName: "",
            company: "",
            phone: "",
            address1: "",
            address2: "",
            city: "",
            country: "",
            state: "",
            zip: ""
        }
    });

    const [userId] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser)._id : null;
    });
    
    console.log("User ID:", userId);
    

    // Fetch countries list
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axios.get("https://restcountries.com/v3.1/all");
                const sortedCountries = response.data
                    .map(country => ({
                        name: country.name.common,
                        code: country.cca2
                    }))
                    .sort((a, b) => a.name.localeCompare(b.name));
                setCountries(sortedCountries);
            } catch (error) {
                console.error("Error fetching countries:", error);
            }
        };
        fetchCountries();
    }, []);

    // Fetch user's payment methods
    useEffect(() => {
        const fetchPaymentMethods = async () => {
            if (!userId) return;
            
            try {
                const response = await axios.get(`${BASE_URL}/api/payment-methods?userId=${userId}`);
                setPaymentMethods(response.data);
            } catch (error) {
                console.error("Error fetching payment methods:", error);
            }
        };
        fetchPaymentMethods();
    }, [userId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("billingAddress.")) {
            const field = name.split(".")[1];
            setFormData(prev => ({
                ...prev,
                billingAddress: {
                    ...prev.billingAddress,
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId) {
            alert("User not authenticated!");
            return;
        }

        try {
            const response = await axios.post(`${BASE_URL}/api/payment-methods`, {
                ...formData,
                userId
            });

            setPaymentMethods(prev => [...prev, response.data]);
            setIsModalOpen(false);
            setFormData({
                cardNumber: "",
                cvv: "",
                expiry: "",
                cardholderName: "",
                billingAddress: {
                    firstName: "",
                    lastName: "",
                    company: "",
                    phone: "",
                    address1: "",
                    address2: "",
                    city: "",
                    country: "",
                    state: "",
                    zip: ""
                }
            });
        } catch (error) {
            console.error("Error adding payment method:", error);
            alert("Failed to add payment method");
        }
    };

    return (
        <div className="payment-page">
            <div className="payment-methods-list">
                <h2>Your Payment Methods</h2>
                <div className="payment-cards-container">
                    {paymentMethods.map(method => (
                        <div key={method._id} className="payment-card">
                            <div className="card-preview">
                                <div className="card-number">
                                    **** **** **** {method.cardNumber.slice(-4)}
                                </div>
                                <div className="card-details">
                                    <span className="cardholder-name">{method.cardholderName}</span>
                                    <span className="card-expiry">Exp: {method.expiry}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="add-payment-card" onClick={() => setIsModalOpen(true)}>
                        <div className="add-card-content">
                            <span className="plus-icon">+</span>
                            <p>Add New Payment Method</p>
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Add New Payment Method</h2>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                                &times;
                            </button>
                        </div>
                        
                        <form className="payment-form" onSubmit={handleSubmit}>
                            {/* Card Details Section */}
                            <div className="form-section">
                                <h3>Card Information</h3>
                                <div className="input-row">
                                    <div className="input-group">
                                        <label>Card Number</label>
                                        <input
                                            type="text"
                                            name="cardNumber"
                                            value={formData.cardNumber}
                                            onChange={handleInputChange}
                                            placeholder="1234 5678 9012 3456"
                                            required
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>CVV</label>
                                        <input
                                            type="text"
                                            name="cvv"
                                            value={formData.cvv}
                                            onChange={handleInputChange}
                                            placeholder="123"
                                            maxLength="4"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="input-row">
                                    <div className="input-group">
                                        <label>Expiration Date</label>
                                        <input
                                            type="text"
                                            name="expiry"
                                            value={formData.expiry}
                                            onChange={handleInputChange}
                                            placeholder="MM/YY"
                                            required
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Cardholder Name</label>
                                        <input
                                            type="text"
                                            name="cardholderName"
                                            value={formData.cardholderName}
                                            onChange={handleInputChange}
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Billing Address Section */}
                            <div className="form-section">
                                <h3>Billing Address</h3>
                                <div className="input-row">
                                    <div className="input-group">
                                        <label>First Name</label>
                                        <input
                                            type="text"
                                            name="billingAddress.firstName"
                                            value={formData.billingAddress.firstName}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Last Name</label>
                                        <input
                                            type="text"
                                            name="billingAddress.lastName"
                                            value={formData.billingAddress.lastName}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="input-row">
                                    <div className="input-group">
                                        <label>Company</label>
                                        <input
                                            type="text"
                                            name="billingAddress.company"
                                            value={formData.billingAddress.company}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Phone</label>
                                        <input
                                            type="tel"
                                            name="billingAddress.phone"
                                            value={formData.billingAddress.phone}
                                            onChange={handleInputChange}
                                            placeholder="+1 234 567 8900"
                                        />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label>Address Line 1</label>
                                    <input
                                        type="text"
                                        name="billingAddress.address1"
                                        value={formData.billingAddress.address1}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <label>Address Line 2</label>
                                    <input
                                        type="text"
                                        name="billingAddress.address2"
                                        value={formData.billingAddress.address2}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="input-row">
                                    <div className="input-group">
                                        <label>City</label>
                                        <input
                                            type="text"
                                            name="billingAddress.city"
                                            value={formData.billingAddress.city}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>ZIP Code</label>
                                        <input
                                            type="text"
                                            name="billingAddress.zip"
                                            value={formData.billingAddress.zip}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="input-row">
                                    <div className="input-group">
                                        <label>Country</label>
                                        <select
                                            name="billingAddress.country"
                                            value={formData.billingAddress.country}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select Country</option>
                                            {countries.map(country => (
                                                <option key={country.code} value={country.name}>
                                                    {country.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label>State/Province</label>
                                        <input
                                            type="text"
                                            name="billingAddress.state"
                                            value={formData.billingAddress.state}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="save-btn">
                                    Save Payment Method
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddPaymentMethod;