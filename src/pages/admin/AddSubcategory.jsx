import React, { useState, useEffect } from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Modal, Input, Form, Button } from 'antd';
const { TextArea } = Input;
import { BASE_URL } from "../../API/BaseURL";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import axios from 'axios';

const AddSubcategory = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [categories, setCategories] = useState([]); // Store categories
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [subcategories, setSubcategories] = useState([]); // Store subcategories
    const [subcategory, setSubcategory] = useState({
        categoryId: "",
        name: "",
        shortDescription: "",
        detailedDescription: "",
        image: null
    });

    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [editingSubcategory, setEditingSubcategory] = useState(null);


    // Fetch categories from DB
    useEffect(() => {
        axios.get(`${BASE_URL}/api/category/get`)
            .then((response) => {
                console.log("Fetched categories:", response.data); // Debugging log
                setCategories(response.data);
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
            });

        fetchSubcategories();
    }, []);

   
    
    const fetchSubcategories = () => {
        axios.get(`${BASE_URL}/api/subcategory/get`)
        .then((response) => {
            console.log("Fetched subcategories:", response.data); 
            if (Array.isArray(response.data.subCategories)) {
                setSubcategories(response.data.subCategories); 
            } else {
                console.error("Subcategories is not an array:", response.data);
                setSubcategories([]); // Reset to an empty array if incorrect format
            }
        })
        .catch((error) => {
            console.error("Error fetching subcategories:", error);
            setSubcategories([]); // Reset to avoid undefined issues
        });
    };

   

    // Handle Input Change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSubcategory((prev) => ({ ...prev, [name]: value }));
    };

    // Handle File Upload
    const handleFileChange = (e) => {
        setSubcategory((prev) => ({ ...prev, image: e.target.files[0] }));
    };

    // Handle Form Submission
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitting subcategory:", subcategory);

        const formData = new FormData();
        formData.append("categoryId", subcategory.categoryId);
        formData.append("name", subcategory.name);
        formData.append("shortDescription", subcategory.shortDescription);
        formData.append("detailedDescription", subcategory.detailedDescription);
        formData.append("image", subcategory.image);

        axios.post(`${BASE_URL}/api/subcategory/add`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        })
        .then((response) => {
            console.log("Subcategory added:", response.data);
            setIsFormOpen(false);
            setSubcategory({
                categoryId: "",
                name: "",
                shortDescription: "",
                detailedDescription: "",
                image: null
            });

            fetchSubcategories(); // Refresh subcategories after adding
        })
        .catch((error) => {
            console.error("Error adding subcategory:", error);
        });
    };

    const toggleForm = () => {
        setIsFormOpen(!isFormOpen);
    };

    const handleEdit = (subcategoryId) => {
        const subcategoryToEdit = subcategories.find(sub => sub._id === subcategoryId);
        setSelectedSubcategory(subcategoryToEdit);
    };

   

    const handleModalSubmit = () => {
        console.log("Updated Subcategory: ", selectedSubcategory); // Log data before submitting
        axios.put(`${BASE_URL}/api/subcategory/update/${selectedSubcategory._id}`, selectedSubcategory)
            .then(response => {
                console.log("Subcategory updated:", response.data);
                setSelectedSubcategory(null); // Close the modal
                fetchSubcategories(); // Refresh subcategories after update
            })
            .catch(error => {
                console.error("Error updating subcategory:", error);  // More detailed error logging
            });
    };
   
    const handleDelete = (subcategoryId) => {
        axios.delete(`${BASE_URL}/api/subcategory/delete/${subcategoryId}`)
            .then((response) => {
                console.log("Subcategory deleted:", response.data);
                fetchSubcategories(); // Refresh subcategories after deletion
            })
            .catch((error) => {
                console.error("Error deleting subcategory:", error);
            });
    };

   

    return (
        <div>
           <div 
    style={{
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '15px', 
        backgroundColor: '#F5F5F5', 
        borderBottom: '2px solid #ddd'
    }}>
    <h1 style={{ color: 'black' }}>Subcategories</h1>
    <button 
        style={{
            backgroundColor: '#E16A54',
            color: 'white',
            padding: '8px 12px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            marginTop: '13px',
            width: '150px',
            height: '40px'
            
        }} 
        onClick={toggleForm}>
        Add Subcategory
    </button>
</div>... {isFormOpen && (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'white',
        padding: '20px',
        boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.2)',
        width: '500px',
        maxHeight: '80vh', /* Prevent overflow beyond viewport */
        overflowY: 'auto', /* Enable vertical scrolling */
        zIndex: '9999'
    }}>
        {/* Cross Icon */}
        <span style={{
            position: 'absolute',
            top: '10px',
            right: '15px',
            fontSize: '24px',
            color: '#7C444F',
            cursor: 'pointer',
            transition: '0.3s'
        }} onClick={() => setIsFormOpen(false)}>❎</span>

        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#7C444F' }}>Add Subcategory</h2>

        {/* Scrollable Form Container */}
        <div style={{
            width: '100%',
            maxHeight: '65vh', /* Limit form height */
            overflowY: 'auto', /* Enable scroll when needed */
            paddingRight: '10px' /* Ensure padding for scrollbar */
        }}>
            <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ color: '#9F5255' }}>Select Category</label>
                <select name="categoryId" value={subcategory.categoryId} onChange={handleChange} required style={{ padding: '10px', width: '100%', border: '1px solid #9F5255' }}>
                    <option value="">-- Select a Category --</option>
                    {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                </select>

                <label style={{ color: '#9F5255' }}>Subcategory Name</label>
                <input type="text" name="name" value={subcategory.name} onChange={handleChange} placeholder="Enter Subcategory Name" required style={{ padding: '10px', border: '1px solid #9F5255' }} />

                <label style={{ color: '#9F5255' }}>Short Description</label>
                <textarea name="shortDescription" value={subcategory.shortDescription} onChange={handleChange} placeholder="Enter Short Description" style={{ padding: '10px', border: '1px solid #9F5255' }}></textarea>

                <label style={{ color: '#9F5255' }}>Detailed Description</label>
                <ReactQuill
                    theme="snow"
                    value={subcategory?.detailedDescription || ""}
                    onChange={(value) => setSubcategory({ ...subcategory, detailedDescription: value })}
                />

                <label style={{ color: '#9F5255' }}>Subcategory Image</label>
                <input type="file" onChange={handleFileChange} style={{ padding: '10px', border: '1px solid #9F5255' }} />

                <button type="submit" style={{
                    background: '#E16A54',
                    color: '#fff',
                    padding: '10px 20px',
                    border: 'none',
                    cursor: 'pointer',
                    marginTop: '10px',
                }}>
                    Save Subcategory
                </button>
            </form>
        </div>
    </div>
)}



            {/* Display Categories and Subcategories */}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
    {categories.map(category => (
        <div key={category._id} style={{
            background: '#f5f5f5',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            width: '380px'
        }}>
            {/* Category Header */}
            <div style={{
    backgroundColor: '#7C444F',
    color: '#fff',
    padding: '10px',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '18px'  // You can adjust the font size as needed
}}>
    {category.name}
</div>


            {/* Subcategories List */}
            <div style={{ padding: '10px' }}>
                {subcategories.filter(sub => sub.categoryId === category._id).map((sub) => (
                    <div key={sub._id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '5px 0',
                        borderBottom: '1px solid #9F5255',
                        fontWeight: 'bold',
                        fontSize: '16px' ,
                         // You can adjust the font size as needed


                    }}>
                        <span style={{ color: 'black' }}>{sub.name}</span>
                        <div>
                            <EditOutlined 
                                style={{ cursor: 'pointer', marginRight: '10px', color: '#F39E60' }} 
                                onClick={() => handleEdit(sub._id)} 
                            />
                            <DeleteOutlined 
  style={{ cursor: 'pointer', color: '#7C444F' }} 
  onClick={() => {
    if (window.confirm("Do you want to remove subcategory?")) {
      handleDelete(sub._id);
    }
  }} 
/>

                        </div>
                    </div>
                ))}
            </div>

            
        </div>
    ))}
</div>


            {/* Modal for Editing Subcategory */}
            {selectedSubcategory && (
    <Modal
        title="Edit Subcategory"
        open={true}
        onCancel={() => setSelectedSubcategory(null)}
        onOk={handleModalSubmit}
        okButtonProps={{
            style: {
                backgroundColor: '#F39E60', // Button color
                borderColor: '#F39E60', // Border color
                color: '#fff', // Text color
                marginTop: '10px', // Margin to create distance between Cancel and Ok buttons
            }
        }}
        cancelButtonProps={{
            style: {
                color: '#7C444F', // Cancel button text color
                borderColor: '#9F5255', // Border color
            }
        }}
    >
        <Form style={{ padding: '0px 10px 0px 0px', width: '400px' }}>
            <Form.Item
                style={{
                    padding: '10px 0px 0px 10px',
                    width: '380px',
                    marginBottom: '5px',
                }}
                label="Subcategory Name"
            >
                <Input
                    style={{
                        display: 'block',
                        color: '#7C444F', // Text color
                        borderColor: '#9F5255', // Border color
                    }}
                    value={selectedSubcategory.name}
                    onChange={(e) =>
                        setSelectedSubcategory({
                            ...selectedSubcategory,
                            name: e.target.value,
                        })
                    }
                />
            </Form.Item>

            <Form.Item
                style={{
                    padding: '0px 0px 0px 10px',
                }}
                label="Short Description"
            >
                <TextArea
                    style={{
                        color: '#7C444F', // Text color
                        borderColor: '#9F5255', // Border color
                    }}
                    value={selectedSubcategory.shortDescription}
                    onChange={(e) =>
                        setSelectedSubcategory({
                            ...selectedSubcategory,
                            shortDescription: e.target.value,
                        })
                    }
                />
            </Form.Item>

            <Form.Item
                style={{
                    padding: '0px 0px 0px 10px',
                }}
                label="Detailed Description"
            >
                <ReactQuill
  theme="snow"
  value={selectedSubcategory?.detailedDescription || ""}
  onChange={(value) =>
    setSelectedSubcategory({
      ...selectedSubcategory,
      detailedDescription: value,
    })
  }
/>

            </Form.Item>
        </Form>
    </Modal>
)}

            
        </div>
    );
};

export default AddSubcategory;
