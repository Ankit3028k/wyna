import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API_CONFIG from "../../config/api";
import "./AdminDashboard.css";

const AddCategory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    icon: "",
    bannerImage: "",
    featured: false,
    active: true,
    comingSoon: false,
    metaTitle: "",
    metaDescription: "",
    keywords: ""
  });

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
    setLoading(true);
    
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
        keywords: formData.keywords.split(",").map(keyword => keyword.trim()).filter(keyword => keyword)
      };
      
      const response = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.CATEGORIES), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(categoryData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Category added successfully!");
        navigate("/admin/categories");
      } else {
        toast.error(data.message || "Failed to add category");
      }
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to add category");
    } finally {
      setLoading(false);
    }
  };

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
          <h1>Add New Category</h1>
          <p>Create a new product category</p>
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

              <div className="form-group">
                <label htmlFor="sortOrder">Sort Order</label>
                <input
                  type="number"
                  id="sortOrder"
                  name="sortOrder"
                  value={formData.sortOrder || ""}
                  onChange={handleChange}
                  min="0"
                  placeholder="Display order (lower numbers first)"
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
              
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="comingSoon"
                  checked={formData.comingSoon}
                  onChange={handleChange}
                />
                Coming Soon
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
                type="submit"
                className="btn-submit"
                disabled={loading || uploading}
              >
                {loading ? "Adding Category..." : "Add Category"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;