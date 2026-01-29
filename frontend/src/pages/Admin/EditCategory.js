import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import API_CONFIG from "../../config/api";
import "./AdminDashboard.css";

const EditCategory = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    icon: "",
    bannerImage: "",
    parentCategory: "",
    sortOrder: "",
    featured: false,
    active: true,
    metaTitle: "",
    metaDescription: "",
    keywords: ""
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.CATEGORIES));
        const data = await response.json();
        setAllCategories(data.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchCategory = async () => {
      try {
        const response = await fetch(API_CONFIG.buildUrl(`${API_CONFIG.ENDPOINTS.CATEGORIES}/${categoryId}`));
        const data = await response.json();
        
        if (data.success) {
          const category = data.data;
          setFormData({
            name: category.name || "",
            description: category.description || "",
            image: category.image || "",
            icon: category.icon || "",
            bannerImage: category.bannerImage || "",
            parentCategory: category.parentCategory || "",
            sortOrder: category.sortOrder || "",
            featured: category.featured || false,
            active: category.active || true,
            metaTitle: category.metaTitle || "",
            metaDescription: category.metaDescription || "",
            keywords: category.keywords?.join(", ") || ""
          });
        } else {
          toast.error("Category not found");
          navigate("/admin/categories");
        }
      } catch (error) {
        console.error("Error fetching category:", error);
        toast.error("Failed to load category");
        navigate("/admin/categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    if (categoryId) {
      fetchCategory();
    } else {
      setLoading(false);
    }
  }, [categoryId, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    if (!imageFile) {
      return "";
    }
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const token = localStorage.getItem("adminToken");
      const response = await fetch(API_CONFIG.buildUrl(`${API_CONFIG.ENDPOINTS.UPLOAD_MULTIPLE('categories')}`), {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data.url;
      } else {
        toast.error(data.message || "Failed to upload image");
        return "";
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Error uploading image");
      return "";
    } finally {
      setUploading(false);
    }
  };

  const removeImagePreview = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData(prev => ({
      ...prev,
      image: ""
    }));
    // Revoke object URL to free memory
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCategoryLoading(true);
    
    try {
      const token = localStorage.getItem("adminToken");
      
      // Upload image if provided
      let uploadedImageUrl = "";
      if (imageFile) {
        uploadedImageUrl = await uploadImage();
        if (!uploadedImageUrl) {
          throw new Error("Failed to upload image");
        }
      }
      
      // Prepare category data
      const categoryData = {
        ...formData,
        image: uploadedImageUrl || formData.image, // Use uploaded image URL or existing URL
        sortOrder: formData.sortOrder ? Number(formData.sortOrder) : 0,
        keywords: formData.keywords.split(",").map(keyword => keyword.trim()).filter(keyword => keyword)
      };
      
      const response = await fetch(API_CONFIG.buildUrl(`${API_CONFIG.ENDPOINTS.CATEGORIES}/${categoryId}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(categoryData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Category updated successfully!");
        navigate("/admin/categories");
      } else {
        toast.error(data.message || "Failed to update category");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      
      const response = await fetch(API_CONFIG.buildUrl(`${API_CONFIG.ENDPOINTS.CATEGORIES}/${categoryId}`), {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Category deleted successfully!");
        navigate("/admin/categories");
      } else {
        toast.error(data.message || "Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-sidebar">
          <div className="admin-logo">
            <img src="/Asset/logo.jpeg" alt="WYNA" />
            <h2>WYNA Admin</h2>
          </div>
        </div>
        <div className="admin-content">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading category...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className="admin-logo">
          <img src="/Asset/logo.jpeg" alt="WYNA" />
          <h2>WYNA Admin</h2>
        </div>
        <nav className="admin-nav">
          <button onClick={() => navigate("/admin/categories")}>
            ← Back to Categories
          </button>
        </nav>
      </div>

      <div className="admin-content">
        <div className="admin-header">
          <h1>Edit Category</h1>
          <p>Update category details</p>
        </div>

        <div className="add-product-form">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Category Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter category name"
                  maxLength="50"
                />
              </div>

              <div className="form-group">
                <label htmlFor="parentCategory">Parent Category</label>
                <select
                  id="parentCategory"
                  name="parentCategory"
                  value={formData.parentCategory}
                  onChange={handleChange}
                >
                  <option value="">No parent (Top level)</option>
                  {allCategories
                    .filter(cat => cat._id !== categoryId)
                    .map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))
                  }
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="image">Category Image</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={uploading}
                />
                {uploading && <p className="upload-status">Uploading image...</p>}
                {imagePreview && (
                  <div className="image-preview-container">
                    <img src={imagePreview} alt="Preview" className="image-preview" />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={removeImagePreview}
                      disabled={uploading}
                    >
                      ×
                    </button>
                  </div>
                )}
                <input
                  type="text"
                  id="imageUrl"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="Or enter image URL"
                />
              </div>

              <div className="form-group">
                <label htmlFor="icon">Icon Class</label>
                <input
                  type="text"
                  id="icon"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  placeholder="e.g., fas fa-tshirt"
                />
              </div>

              <div className="form-group">
                <label htmlFor="bannerImage">Banner Image URL</label>
                <input
                  type="text"
                  id="bannerImage"
                  name="bannerImage"
                  value={formData.bannerImage}
                  onChange={handleChange}
                  placeholder="Enter banner image URL"
                />
              </div>

              <div className="form-group">
                <label htmlFor="sortOrder">Sort Order</label>
                <input
                  type="number"
                  id="sortOrder"
                  name="sortOrder"
                  value={formData.sortOrder}
                  onChange={handleChange}
                  min="0"
                  placeholder="Display order (lower numbers first)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="metaTitle">Meta Title</label>
                <input
                  type="text"
                  id="metaTitle"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleChange}
                  placeholder="SEO meta title"
                  maxLength="60"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                required
                placeholder="Category description"
                maxLength="500"
              />
            </div>

            <div className="form-group">
              <label htmlFor="metaDescription">Meta Description</label>
              <textarea
                id="metaDescription"
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                rows="3"
                placeholder="SEO meta description"
                maxLength="160"
              />
            </div>

            <div className="form-group">
              <label htmlFor="keywords">Keywords (comma separated)</label>
              <input
                type="text"
                id="keywords"
                name="keywords"
                value={formData.keywords}
                onChange={handleChange}
                placeholder="e.g., silk, traditional, women"
              />
            </div>

            <div className="form-checkboxes">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                />
                Featured Category
              </label>
              
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                />
                Active
              </label>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate("/admin/categories")}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-delete"
                onClick={handleDelete}
                disabled={categoryLoading}
              >
                Delete Category
              </button>
              <button
                type="submit"
                className="btn-submit"
                disabled={categoryLoading || uploading}
              >
                {categoryLoading ? "Updating Category..." : "Update Category"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCategory;