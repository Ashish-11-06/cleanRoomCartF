import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../API/BaseURL";


const Sidebar = () => {
  const [categories, setCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [subcategories, setSubcategories] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch all categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/category/get`);
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Function to fetch subcategories for a given category ID
  const fetchSubcategories = async (categoryId) => {
    if (subcategories[categoryId]) return; // Avoid re-fetching if already exists

    try {
      const response = await fetch(
        `${BASE_URL}/api/subcategory/get/${categoryId}`
      );
      if (!response.ok) throw new Error("Failed to fetch subcategories");
      const data = await response.json();

      setSubcategories((prev) => ({
        ...prev,
        [categoryId]: data.subcategories,
      }));
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  // Toggle category to expand/collapse
  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(categoryId)) {
        newExpanded.delete(categoryId); // Collapse when clicking "-"
      } else {
        newExpanded.add(categoryId); // Expand when clicking "+"
        fetchSubcategories(categoryId);
      }
      return new Set(newExpanded);
    });
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Categories</h2>
      <nav className="sidebar-nav">
        {loading ? (
          <p>Loading categories...</p>
        ) : categories.length > 0 ? (
          categories.map((category) => (
            <div key={category._id} className="nav-item">
              <div className="category-container">
                <a
                  href="#"
                  onClick={() => navigate(`/category/${category._id}`)}
                >
                  {category.name}
                </a>
                <span onClick={() => toggleCategory(category._id)}>
                  {expandedCategories.has(category._id) ? "-" : "+"}
                </span>
              </div>

              {expandedCategories.has(category._id) &&
                subcategories[category._id] && (
                  <div className="subcategory-list">
                    {subcategories[category._id].length > 0 ? (
                      subcategories[category._id].map((sub) => (
                        <div
                          key={sub._id}
                          className="subcategory-item"
                          onClick={() =>
                            navigate(`/subcategory/${sub._id}`)
                          }
                        >
                          {sub.name}
                        </div>
                      ))
                    ) : (
                      <p className="subcategory-item">No subcategories</p>
                    )}
                  </div>
                )}
            </div>
          ))
        ) : (
          <p>No categories found</p>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
