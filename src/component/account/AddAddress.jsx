import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../API/BaseURL";
import "./AddAddress.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const AddAddress = () => {
    const [userId, setUserId] = useState(null);
    const [defaultAddress, setDefaultAddress] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [showModal, setShowModal] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);

    const [newAddress, setNewAddress] = useState({
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        country: "",
        zip: ""
    });

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser._id) {
                    setUserId(parsedUser._id);
                } else {
                    setMessage({ type: "error", text: "User ID not found in local storage." });
                }
            } catch (error) {
                setMessage({ type: "error", text: "Failed to parse user data from local storage." });
            }
        } else {
            setMessage({ type: "error", text: "No user data found in local storage." });
        }
    }, []);

    useEffect(() => {
        if (!userId) return;

        const fetchUserData = async () => {
            setLoading(true);
            try {
                const profileRes = await axios.get(`${BASE_URL}/api/consumer/profile/${userId}`);
                const userProfile = profileRes.data.user;

                if (userProfile) {
                    setDefaultAddress({
                        addressLine1: userProfile.addressLine1 || "N/A",
                        addressLine2: userProfile.addressLine2 || "",
                        city: userProfile.city || "N/A",
                        state: userProfile.state || "N/A",
                        country: userProfile.country || "N/A",
                        zip: userProfile.zip || "N/A"
                    });
                } else {
                    setDefaultAddress(null);
                }

                const addressRes = await axios.get(`${BASE_URL}/api/address/addresses/user/${userId}`);
                if (addressRes.data && addressRes.data.addresses) {
                    setAddresses(addressRes.data.addresses);
                } else {
                    setAddresses([]);
                    setMessage({ type: "error", text: "Failed to fetch addresses." });
                }

            } catch (error) {
                setMessage({ type: "error", text: "Failed to load profile data" });
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    const handleInputChange = (e) => {
        setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
    };

    const handleAddAddress = async () => {
        if (!userId) {
            setMessage({ type: "error", text: "User ID is required. Please log in again." });
            return;
        }

        const { addressLine1, city, state, country, zip } = newAddress;
        if (!addressLine1 || !city || !state || !country || !zip) {
            setMessage({ type: "error", text: "Please fill all required fields." });
            return;
        }

        try {
            const addressData = { userId, ...newAddress };
            await axios.post(`${BASE_URL}/api/address/addresses`, addressData);

            const addressRes = await axios.get(`${BASE_URL}/api/address/addresses/user/${userId}`);
            if (addressRes.data && addressRes.data.addresses) {
                setAddresses(addressRes.data.addresses);
            } else {
                setAddresses([]);
            }

            setShowModal(false);
            setNewAddress({ addressLine1: "", addressLine2: "", city: "", state: "", country: "", zip: "" });
            setMessage({ type: "success", text: "Address added successfully!" });

        } catch (error) {
            setMessage({ type: "error", text: "Failed to add address. Try again." });
        }
    };
    const handleUpdateAddress = async () => {
        try {
            await axios.put(`${BASE_URL}/api/address/addresses/edit/${editingAddressId}`, newAddress);
            const updatedAddresses = addresses.map(addr =>
                addr._id === editingAddressId ? { ...addr, ...newAddress } : addr
            );
            setAddresses(updatedAddresses);
            setEditingAddressId(null);
            setNewAddress({ addressLine1: "", addressLine2: "", city: "", state: "", country: "", zip: "" });
            setMessage({ type: "success", text: "Address updated successfully!" });
        } catch (error) {
            setMessage({ type: "error", text: "Failed to update address. Please try again." });
        }
    };
    const handleDeleteAddress = async (addressId) => {
        try {
            await axios.delete(`${BASE_URL}/api/address/addresses/delete/${addressId}`);
            setAddresses(addresses.filter(addr => addr._id !== addressId));
            setMessage({ type: "success", text: "Address deleted successfully!" });
        } catch (error) {
            setMessage({ type: "error", text: "Failed to delete address. Please try again." });
        }
    };
    const handleEditClick = (address) => {
        setEditingAddressId(address._id);
        setNewAddress({
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2,
            city: address.city,
            state: address.state,
            country: address.country,
            zip: address.zip
        });
        setShowModal(true);
    };

    return (
        <div className="address-container">

            {message.text && <div className={`alert ${message.type}`}>{message.text}</div>}

            {loading ? (
                <p>Loading addresses...</p>
            ) : (
                <div className="address-cards">
                    {defaultAddress ? (
                        <div className="address-card default">
                            <div className="card-header">
                                <h3>Default Address</h3>
                                <span className="badge">Primary</span>
                            </div>
                            <div className="address-details">
                                <p className="address-line">
                                    {defaultAddress.addressLine1}
                                    {defaultAddress.addressLine2 && `, ${defaultAddress.addressLine2}`}
                                </p>
                                <div className="location-info">
                                    <span className="city">{defaultAddress.city}</span>
                                    <span className="divider">•</span>
                                    <span className="state">{defaultAddress.state}</span>
                                </div>
                                <div className="country-zip">
                                    <span className="country">{defaultAddress.country}</span>
                                    <span className="zip-code">{defaultAddress.zip}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="address-card warning">
                            <p>⚠️ No default address found in profile</p>
                            <p>Check API response structure in console</p>
                        </div>
                    )}... {addresses.length > 0 ? (
                        addresses.map((addr) => (
                            <div key={addr._id} className="address-card">
                                <div className="address-actions">
                                    <FontAwesomeIcon icon={faEdit} className="edit-icon" onClick={() => handleEditClick(addr)} />
                                    <FontAwesomeIcon icon={faTrash} className="delete-icon" onClick={() => handleDeleteAddress(addr._id)} />
                                </div>
                                <h4>Address</h4>
                                <p>
                                    {addr.addressLine1}, {addr.addressLine2}, {addr.city}, {addr.state}, {addr.country}, {addr.zip}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p>No additional addresses found.</p>
                    )}

                    <div className="address-card add-new" onClick={() => setShowModal(true)}>
                        <h1>+</h1>
                        <p>Add New Address</p>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            editingAddressId ? handleUpdateAddress() : handleAddAddress();
                        }}>
                            <h3>{editingAddressId ? 'Update Address' : 'Add New Address'}</h3>
                            <input type="text" name="addressLine1" value={newAddress.addressLine1} onChange={handleInputChange} placeholder="Address Line 1" required />
                            <input type="text" name="addressLine2" value={newAddress.addressLine2} onChange={handleInputChange} placeholder="Address Line 2" />
                            <input type="text" name="city" value={newAddress.city} onChange={handleInputChange} placeholder="City" required />
                            <input type="text" name="state" value={newAddress.state} onChange={handleInputChange} placeholder="State" required />
                            <input type="text" name="country" value={newAddress.country} onChange={handleInputChange} placeholder="Country" required />
                            <input type="text" name="zip" value={newAddress.zip} onChange={handleInputChange} placeholder="ZIP Code" required />
                            <button type="submit">{editingAddressId ? 'Update Address' : 'Add Address'}</button>
                            <button type="button" onClick={() => {
                                setShowModal(false);
                                setEditingAddressId(null);
                                setNewAddress({ addressLine1: "", addressLine2: "", city: "", state: "", country: "", zip: "" });
                            }}>Close</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddAddress;
