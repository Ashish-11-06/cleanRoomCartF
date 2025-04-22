import React from 'react'
import { EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { Modal, Input, Form, Button, Select, Upload ,InputNumber} from 'antd';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { BASE_URL } from "../../API/BaseURL";


const { TextArea } = Input;


const AddProduct = () => {

  const [categories, setCategories] = useState([]); // Store categories
  const [subcategories, setSubcategories] = useState([]); // Store subcategories
  const [allSubcategories, setAllSubcategories] = useState([]); // Store all subcategories
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [products, setProducts] = useState([]); // Store fetched products
  const [loading, setLoading] = useState(false); // Show loader while fetching
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);



  useEffect(() => {
    axios.get(`${BASE_URL}/api/category/get`)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);


  // Fetch subcategories based on selected category
  useEffect(() => {
    if (selectedCategory) {
      axios
        .get(`${BASE_URL}/api/subcategory/get?categoryId=${selectedCategory}`)
        .then((response) => {
          if (response.data.subCategories && Array.isArray(response.data.subCategories)) {
            // 🔥 Filter Subcategories based on Selected Category
               const filtered = response.data.subCategories.filter(
              (sub) => sub.categoryId === selectedCategory
            );

            setSubcategories(filtered); // ✅ Set Filtered Subcategories
          } else {
            console.error("Unexpected response format:", response.data);
            setSubcategories([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching subcategories:", error);
          setSubcategories([]);
        });
    } else {
      setSubcategories([]); // Reset when no category is selected
    }
  }, [selectedCategory]);



  // Handle Category Selection
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(null); // Reset subcategory when category changes
  };




  // Handle Subcategory Selection
  const handleSubcategoryChange = (value) => {
    setSelectedSubcategory(value);
  };


  const handleUpdateProduct = async (values, productId) => {
    try {
      const response = await axios.put(`${BASE_URL}/api/product/update/${productId}`, values);

      if (response.status === 200) {
        alert("Product updated successfully!");
        setIsEditModalVisible(false); // Close the modal
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product. Please try again.");
    }
  };






  const handleSeeProducts = async () => {
    if (!selectedCategory || !selectedSubcategory) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/product/get?categoryId=${selectedCategory}&subcategoryId=${selectedSubcategory}`
      );

      console.log("Fetched Products:", response.data);
      if (Array.isArray(response.data)) {
        setProducts([...response.data]); // Ensure new reference
      } else if (response.data.products) {
        setProducts([...response.data.products]); // If products are nested
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    console.log("Updated Products State:", products);
  }, [products]);







  // Handle Form Submission
  const onFinish = async (values) => {
    try {
      const formData = new FormData();
  
      // Ensure category and subcategory are selected
      if (!values.category || !values.subcategory) {
        alert("Please select a category and subcategory.");
        return;
      }
  
      formData.append("category", values.category);
      formData.append("subcategory", values.subcategory);
      formData.append("productName", values.productName);
      formData.append("productCode", values.productCode);
      formData.append("price", values.price); // Add price to form data
      formData.append("description", values.description);
  
      // Handle image upload safely
      if (values.image?.fileList?.length > 0) {
        formData.append("image", values.image.fileList[0].originFileObj);
      } else {
        alert("Please upload an image.");
        return;
      }
  
      // Debugging FormData before sending
      console.log("Form Data Entries:");
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
  
      // API Call
      const response = await axios.post(`${BASE_URL}/api/product/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (response.status === 201) {
        console.log("Product added successfully:", response.data);
        alert("Product added successfully!");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert(error.response?.data?.message || "Error adding product.");
    }
  };
  
  



  // Toggle Form Visibility
  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  // Handle Edit Product
  const handleDelete = async (productId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/api/product/delete/${productId}`);

      if (response.status === 200) {
        alert("Product deleted successfully!");
        setProducts(products.filter(product => product._id !== productId)); // Remove product from UI
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);  // Store the product data
    setIsEditModalVisible(true); // Open the modal
  };


  return (
    <div>
      <div
    style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px',
        backgroundColor: '#F5F5F5', // Default background color (use from your palette if you want to replace)
        borderBottom: '2px solid #ddd',
        borderRadius: '0px'
    }}
>
    <h1>Add Product</h1>
</div>


      {/* Form for selecting Category and Subcategory */}
      <div style={{ marginTop: "-15px", padding: "10px", borderRadius: "0px" ,alignItems: 'center',fontSize: '16px'}}>
      <h2 style={{ paddingLeft: '0px', color: '#7C444F', textAlign: 'center' }}>
      Select Category and Subcategory to add products.
</h2>

  <Form style={{ alignItems: 'center', width: '500px', margin: "auto", padding: "inherit", backgroundColor: '#F5F5F5', borderRadius: '0px', borderBottom: '2px solid #ddd'}}>

    {/* Category Dropdown */}
    <Form.Item label="Select Category" style={{ padding: '20px 0px 0px 0px', height: '80px', color: '#9F5255' }}>
      <Select
        style={{ width: '100%', borderColor: '#E16A54', color: '#7C444F' }}
        value={selectedCategory}
        onChange={handleCategoryChange}
        placeholder="Select a Category"
      >
        {categories.map((category) => (
          <Select.Option key={category._id} value={category._id} style={{ color: 'black' }}>
            {category.name}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>

    {/* Subcategory Dropdown */}
    <Form.Item label="Select Subcategory" style={{ padding: '0px 0px 0px 0px', height: '60px', color: 'black' }}>
      <Select
        style={{ width: '100%', borderColor: '#E16A54', color: '#7C444F' }}
        value={selectedSubcategory}
        onChange={handleSubcategoryChange}
        placeholder="Select a Subcategory"
        disabled={!selectedCategory} // Disable if no category selected
      >
        {subcategories.map((subcategory) => (
          <Select.Option key={subcategory._id} value={subcategory._id} style={{ color: 'black' }}>
            {subcategory.name}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>

    {/* Buttons */}
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Button
        type="primary"
        onClick={toggleForm}
        style={{ width: '48%', backgroundColor: '#E16A54', borderColor: '#E16A54',color: '#ffffff' }}
        disabled={!selectedCategory || !selectedSubcategory}
      >
        {isFormVisible ? "Close Form" : "Add Product"}
      </Button>

      <Button
        type="default"
        onClick={handleSeeProducts}
        style={{ width: '48%', backgroundColor: '#E16A54', borderColor: '#F39E60', color: '#ffffff' }}
        disabled={!selectedCategory || !selectedSubcategory}
      >
        Show Products
      </Button>
    </div>
  </Form>
</div>









<Modal
  title={<span style={{ color: "#7C444F" }}>Edit Product</span>}
  open={isEditModalVisible}
  onCancel={() => setIsEditModalVisible(false)}
  footer={null}
  centered
>
  {editingProduct && (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", width: "100%" }}>
      <Form
        style={{ width: "80%", maxWidth: "400px", padding: "20px", textAlign: "center" }}
        layout="vertical"
        initialValues={{
          productName: editingProduct.productName,
          productCode: editingProduct.productCode,
          price: editingProduct.price,
          description: editingProduct.description,
        }}
        onFinish={(values) => handleUpdateProduct(values, editingProduct._id)}
      >
        {/* Product Name */}
        <Form.Item 
          style={{ height: '60px' }} 
          label={<span style={{ color: "#9F5255" }}>Product Name</span>} 
          name="productName" 
          rules={[{ required: true, message: "Enter product name" }]}
        >
          <Input placeholder="Enter product name" style={{ borderColor: "#E16A54", color: "#7C444F" }} />
        </Form.Item>

        {/* Product Code */}
        <Form.Item 
          style={{ height: '60px' }} 
          label={<span style={{ color: "#9F5255" }}>Product Code</span>} 
          name="productCode" 
          rules={[{ required: true, message: "Enter product code" }]}
        >
          <Input placeholder="Enter product code" style={{ borderColor: "#E16A54", color: "#7C444F" }} />
        </Form.Item>

        {/* Price */}
        <Form.Item 
          style={{ height: '60px' }} 
          label={<span style={{ color: "#9F5255" }}>Price</span>} 
          name="price" 
          rules={[{ required: true, message: "Enter product price" }]}
        >
          <InputNumber placeholder="Enter product price" style={{ borderColor: "#E16A54", color: "#7C444F", width: "100%" }} />
        </Form.Item>

        {/* Description */}
        <Form.Item 
          style={{ height: '105px' }} 
          label={<span style={{ color: "#9F5255" }}>Description</span>} 
          name="description" 
          rules={[{ required: true, message: "Enter description" }]}
        >
          <Input.TextArea rows={3} placeholder="Enter product description" style={{ borderColor: "#E16A54", color: "#7C444F" }} />
        </Form.Item>

        <Button 
          type="primary" 
          htmlType="submit" 
          style={{ marginTop: "10px", backgroundColor: '#E16A54', borderColor: '#E16A54', width: "100%" }}
        >
          Update Product
        </Button>
      </Form>
    </div>
  )}
</Modal>















{isFormVisible && (
  <div
    style={{
      marginTop: "20px",
      marginLeft: "15%",
      padding: "10px",
      borderRadius: "0px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <div style={{ width: "100%", maxWidth: "600px" }}>
      <h2 style={{ color: "#7C444F", textAlign: "center" ,      marginLeft: "-33%",
}}>Enter Product Details</h2>
      <Form
        style={{ padding: '21px' }}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ category: selectedCategory, subcategory: selectedSubcategory }}
      >
        {/* Category */}
        <Form.Item style={{ height: '60px' }} label={<span style={{ color: "#9F5255" }}>Select Category</span>} name="category">
          <Select value={selectedCategory} onChange={handleCategoryChange} style={{ borderColor: "#E16A54", color: "#7C444F" }}>
            {categories.map((category) => (
              <Select.Option key={category._id} value={category._id}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* Subcategory */}
        <Form.Item style={{ height: '60px' }} label={<span style={{ color: "#9F5255" }}>Select Subcategory</span>} name="subcategory">
          <Select value={selectedSubcategory} onChange={handleSubcategoryChange} disabled={!selectedCategory} style={{ borderColor: "#E16A54", color: "#7C444F" }}>
            {subcategories.map((subcategory) => (
              <Select.Option key={subcategory._id} value={subcategory._id}>
                {subcategory.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* Product Name */}
        <Form.Item style={{ height: '60px' }} label={<span style={{ color: "#9F5255" }}>Product Name</span>} name="productName" rules={[{ required: true, message: "Please enter product name" }]}>
          <Input placeholder="Enter product name" style={{ borderColor: "#E16A54", color: "#7C444F" }} />
        </Form.Item>

        {/* Product Code */}
        <Form.Item style={{ height: '60px' }} label={<span style={{ color: "#9F5255" }}>Product Code</span>} name="productCode" rules={[{ required: true, message: "Please enter product code" }]}>
          <Input placeholder="Enter product code" style={{ borderColor: "#E16A54", color: "#7C444F" }} />
        </Form.Item>

        {/* Price */}
        <Form.Item style={{ height: '60px' }} label={<span style={{ color: "#9F5255" }}>Price</span>} name="price" rules={[{ required: true, message: "Please enter product price" }]}>
          <InputNumber placeholder="Enter product price" style={{ borderColor: "#E16A54", color: "#7C444F", width: '100%' }} />
        </Form.Item>

        {/* Description */}
        <Form.Item style={{ height: '105px' }} label={<span style={{ color: "#9F5255" }}>Description</span>} name="description" rules={[{ required: true, message: "Please enter product description" }]}>
          <TextArea rows={3} placeholder="Enter product description" style={{ borderColor: "#E16A54", color: "#7C444F" }} />
        </Form.Item>

        {/* Product Image */}
        <Form.Item
          label={<span style={{ color: "#9F5255" }}>Product Image</span>}
          name="image"
          rules={[{ required: true, message: "Please upload Image" }]}
        >
          <Upload
            beforeUpload={() => false}
            listType="picture"
            onChange={(info) => console.log("Uploaded Image:", info)}
          >
            <Button icon={<UploadOutlined />} style={{ color: "#F39E60", borderColor: "#E16A54" }}>
              Upload Image
            </Button>
          </Upload>
        </Form.Item>

        <Button
          style={{
            backgroundColor: '#E16A54',
            marginTop: '-60px',
            borderColor: '#E16A54',
            color: "#fff",
            width: "70%",
            marginLeft: '15%'
          }}
          type="primary"
          htmlType="submit"
        >
          Add Product
        </Button>
      </Form>
    </div>
  </div>
)}












{products.length > 0 && (
  <div style={{ marginTop: "20px", padding: "10px", borderRadius: "0px" }}>
    <h2 style={{ color: "#7C444F" }}>All Products</h2>
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ backgroundColor: "#9F5255", color: "#fff" }}>
          <th style={{ padding: "10px", textAlign: "left" }}>Product Name</th>
          <th style={{ padding: "10px", textAlign: "left" }}>Description</th>
          <th style={{ padding: "10px", textAlign: "left" }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product._id} style={{ borderBottom: "1px solid #ddd", fontSize: "16px", color: "#7C444F" }}>
            <td style={{ padding: "10px" }}>{product.productName}</td>
            <td style={{ padding: "10px" }}>{product.description}</td>
            <td style={{ padding: "10px", display: "flex", flexDirection: "column", gap: "5px" }}>
              <div style={{ display: "flex", gap: "5px" }}>
                {/* Edit Button - Soft Orange */}
                <Button
                  style={{
                    backgroundColor: "#F39E60",
                    color: "white",
                    border: "none",
                    fontSize: "12px",
                    padding: "5px 10px",
                  }}
                  onClick={() => handleEdit(product)}
                >
                  Edit
                </Button>

                {/* Delete Button - Warm Coral */}
                <Button
                  style={{
                    backgroundColor: "#E16A54",
                    color: "white",
                    border: "none",
                    fontSize: "12px",
                    padding: "5px 10px",
                  }}
                  onClick={() => {
                    if (window.confirm("Do you want to remove this product?")) {
                      handleDelete(product._id);
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}


    </div>
  )
}

export default AddProduct