import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AccountSettings.css";
import { FaUserCircle } from "react-icons/fa";
import { BASE_URL } from "../../API/BaseURL";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AccountSettings = () => {
  const [userData, setUserData] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});

  // Retrieve user ID from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user._id : null;

  useEffect(() => {
    if (!userId) {
      setFetchError("User ID not found. Please log in.");
      return;
    }
    fetchUserById();
  }, [userId]);

  // Fetch user data from backend
  const fetchUserById = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/consumer/profile/${userId}`);

      if (response.data && response.data.user) {
        setUserData(response.data.user);
      } else {
        setFetchError("Invalid response from server.");
      }
    } catch (error) {
      setFetchError("An error occurred while fetching user data.");
    }
  };

  // Open the modal with pre-filled user data
  const handleOpenModal = () => {
    if (!userData) return;
    setFormData({ ...userData });
    setIsModalOpen(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save profile updates
  const handleSaveChanges = async () => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/consumer/update-profile/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.status === 200 && response.data.user) {
        setUserData(response.data.user); // Update displayed user data
        toast.success("Profile updated successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setIsModalOpen(false); // Close modal
      }
    } catch (error) {
      toast.error("Error updating profile. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="account-settings-container">
      <ToastContainer />
      <div className="profile-section">
        <FaUserCircle className="profile-icon" />
        {userData ? (
          <h3>
            {userData.firstName} {userData.lastName}
          </h3>
        ) : (
          <p>Loading user details...</p>
        )}
      </div>

      <div className="details-section">
        {fetchError && <div className="error">{fetchError}</div>}
        {userData ? (
          <div className="user-details">
            <p>
              <strong>Email:</strong> {userData.email}
            </p>
            <p>
              <strong>Phone:</strong> {userData.phoneNumber}
            </p>
            <p>
              <strong>Address:</strong> {userData.addressLine1}, {userData.addressLine2}, {userData.city}, {userData.state}, {userData.country}, {userData.zip}
            </p>

            <button className="update-profile-btn" onClick={handleOpenModal}>
              Update Profile
            </button>
          </div>
        ) : (
          <p>Loading user details...</p>
        )}
      </div>

      {/* Update Profile Modal */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Update Profile</h2>

            <label>First Name:</label>
            <input type="text" name="firstName" value={formData.firstName || ""} onChange={handleChange} />

            <label>Last Name:</label>
            <input type="text" name="lastName" value={formData.lastName || ""} onChange={handleChange} />

            <label>Email:</label>
            <input type="email" name="email" value={formData.email || ""} onChange={handleChange} />

            <label>Phone Number:</label>
            <input type="text" name="phoneNumber" value={formData.phoneNumber || ""} onChange={handleChange} />

            <label>Address:</label>
            <input type="text" name="addressLine1" value={formData.addressLine1 || ""} onChange={handleChange} />
            <input type="text" name="addressLine2" value={formData.addressLine2 || ""} onChange={handleChange} />
            <input type="text" name="city" value={formData.city || ""} onChange={handleChange} />
            <input type="text" name="state" value={formData.state || ""} onChange={handleChange} />
            <input type="text" name="country" value={formData.country || ""} onChange={handleChange} />
            <input type="text" name="zip" value={formData.zip || ""} onChange={handleChange} />

            <button className="save-changes-btn" onClick={handleSaveChanges}>
              Save Changes
            </button>
            <button className="close-modal-btn" onClick={handleCloseModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;
