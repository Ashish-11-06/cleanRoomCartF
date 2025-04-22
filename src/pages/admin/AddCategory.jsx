import { Card, Modal, Input, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../API/BaseURL";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import "./AddCategory.css";

const AddCategory = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState({
    name: "",
    shortDescription: "",
    detailedDescription: "",
    image: null,
  });
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch Categories
  const fetchCategories = () => {
    axios
      .get(`${BASE_URL}/api/category/get`)
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Error fetching categories:", error));
  };

  const toggleForm = () => setIsFormOpen(!isFormOpen);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  const handleFileChange = (e) => {
    setCategory({ ...category, image: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (category.name.trim() === "") {
      alert("Category Name is required!");
      return;
    }

    const formData = new FormData();
    formData.append("name", category.name);
    formData.append("shortDescription", category.shortDescription);
    formData.append("detailedDescription", category.detailedDescription);
    formData.append("image", category.image);

    axios
      .post(`${BASE_URL}/api/category/add`, formData)
      .then(() => {
        fetchCategories(); // Refresh the list after adding
        setCategory({ name: "", shortDescription: "", detailedDescription: "", image: null });
        setIsFormOpen(false);
      })
      .catch((error) => console.error("Error adding category:", error));
  };

  const handleEdit = (id) => {
    const selectedCategory = categories.find((cat) => cat._id === id);
    if (selectedCategory) {
      setEditingCategory(selectedCategory);
      setIsEditModalOpen(true);
    }
  };

  const handleEditChange = (e) => {
    if (e.target) {
      const { name, value } = e.target;
      setEditingCategory({ ...editingCategory, [name]: value });
    } else {
      // Handle Quill input changes
      setEditingCategory({ ...editingCategory, detailedDescription: e });
    }
  };

  const handleUpdate = () => {
    axios
      .put(`${BASE_URL}/api/category/update/${editingCategory._id}`, editingCategory)
      .then(() => {
        fetchCategories(); // Refresh the list
        setIsEditModalOpen(false);
        setEditingCategory(null);
      })
      .catch((error) => console.error("Error updating category:", error));
  };

  const handleDelete = (id) => {
    axios
      .delete(`${BASE_URL}/api/category/delete/${id}`)
      .then(() => {
        fetchCategories();
      })
      .catch((error) => console.error("Error deleting category:", error));
  };

  return (
    <div>
      <div className="header">
        <h1>Categories</h1>
        <button className="add-btn" onClick={toggleForm}>Add Category</button>
      </div>

      {isFormOpen && (
        <div className="form-container">
          <span className="close-icon" onClick={() => setIsFormOpen(false)}>❎</span>
          <h2>Add Category</h2>
          <form onSubmit={handleSubmit}>
            <label>Category Name</label>
            <input type="text" name="name" value={category.name} onChange={handleChange} required />
            <label>Short Description</label>
            <textarea name="shortDescription" value={category.shortDescription} onChange={handleChange}></textarea>
            <label>Detailed Description</label>
            <ReactQuill
              theme="snow"
              value={category.detailedDescription}
              onChange={(value) => setCategory({ ...category, detailedDescription: value })}
            />
            <label>Category Image</label>
            <input type="file" onChange={handleFileChange} />
            <button type="submit" className="save-btn">Save Category</button>
          </form>
        </div>
      )}

      <h1 className="list-header">List of Categories</h1>
      <ul className="category-list">
        {categories.map((category) => (
          <li key={category._id} className="category-item" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
            <span className="category-name" style={{ fontWeight: "bold", fontSize: "16px" }}>{category.name}</span>
            <div className="buttons" style={{ display: "flex", gap: "8px" }}>
              <button 
                className="edit-button" 
                style={{ 
                  backgroundColor: "#4CAF50", 
                  color: "white", 
                  border: "none", 
                  padding: "6px 12px", 
                  cursor: "pointer", 
                  borderRadius: "0", // Changed here
                  fontSize: "14px", 
                  fontWeight: "bold" 
                }} 
                onClick={() => handleEdit(category._id)}
              >
                Edit
              </button>
              <button 
                className="delete-button" 
                style={{ 
                  backgroundColor: "#E74C3C", 
                  color: "white", 
                  border: "none", 
                  padding: "6px 12px", 
                  cursor: "pointer", 
                  borderRadius: "0", // Changed here
                  fontSize: "14px", 
                  fontWeight: "bold" 
                }} 
                onClick={() => {
                  if (window.confirm("Do you want to remove category?")) {
                    handleDelete(category._id);
                  }
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Edit Category Modal */}
      <Modal
        title="Edit Category"
        open={isEditModalOpen}
        onOk={handleUpdate}
        onCancel={() => setIsEditModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>,
          <Button key="update" type="primary" onClick={handleUpdate}>Update</Button>
        ]}
        centered
        bodyStyle={{ maxHeight: '400px', overflowY: 'auto' }}
      >
        <label>Category Name</label>
        <Input type="text" name="name" value={editingCategory?.name || ""} onChange={handleEditChange} />
        <label>Short Description</label>
        <Input.TextArea name="shortDescription" value={editingCategory?.shortDescription || ""} onChange={handleEditChange} />
        <label>Detailed Description</label>
        <ReactQuill
          theme="snow"
          value={editingCategory?.detailedDescription || ""}
          onChange={(value) => setEditingCategory({ ...editingCategory, detailedDescription: value })}
        />
      </Modal>
    </div>
  );
};

export default AddCategory;
