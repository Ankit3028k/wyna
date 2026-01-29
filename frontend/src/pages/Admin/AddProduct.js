
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ImageSelector from '../../components/Admin/ImageSelector';
import API_CONFIG from "../../config/api";
import "./AdminDashboard.css";

const AddProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    shortDescription: "",
    price: "",
    discountPrice: "",
    category: "",
    stock: "",
    material: "",
    weaveType: "",
    color: "",
    pattern: "",
    length: "",
    width: "",
    weight: "",
    careInstructions: "",
    tags: "",
    customizable: false,
    featured: false,
    newArrival: false
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.CATEGORIES));
        const data = await response.json();
        setCategories(data.data || []);
        
        // Set default category if available
        if (data.data && data.data.length > 0) {
          setFormData(prev => ({ ...prev, category: data.data[0]._id }));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      }
    };
    
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    
    // Create previews
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const uploadImages = async () => {
    // Combine uploaded files with selected server images
    const uploadedImages = [];
    
    // Upload new files if any
    if (imageFiles.length > 0) {
      setUploading(true);
      try {
        const formData = new FormData();
        imageFiles.forEach((file, index) => {
          formData.append('images', file);
        });
        
        const token = localStorage.getItem("adminToken");
        const response = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.UPLOAD_MULTIPLE('products')), {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          },
          body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
          uploadedImages.push(...data.urls.map(img => ({
            url: img.url,
            alt: "Uploaded image",
            isPrimary: false
          })));
        } else {
          toast.error(data.message || "Failed to upload images");
        }
      } catch (error) {
        console.error("Image upload error:", error);
        toast.error("Error uploading images");
      } finally {
        setUploading(false);
      }
    }
    
    // Return combined images (uploaded + selected from server)
    return [...selectedImages, ...uploadedImages];
  };

  const removeImagePreview = (index) => {
    const newImageFiles = [...imageFiles];
    newImageFiles.splice(index, 1);
    setImageFiles(newImageFiles);
    
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
    
    // Revoke object URL to free memory
    URL.revokeObjectURL(imagePreviews[index]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem("adminToken");
      
      // Upload images first
      const uploadedImages = await uploadImages();
      
      // Prepare product data
      const productData = {
        ...formData,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
        stock: Number(formData.stock),
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
        images: uploadedImages // Add combined images to product data
      };
      
      const response = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.PRODUCTS), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Product added successfully!");
        // Reset form
        setFormData({
          name: "",
          description: "",
          shortDescription: "",
          price: "",
          discountPrice: "",
          category: "",
          stock: "",
          material: "",
          weaveType: "",
          color: "",
          pattern: "",
          length: "",
          width: "",
          weight: "",
          careInstructions: "",
          tags: "",
          customizable: false,
          featured: false,
          newArrival: false,
          status: "draft"
        });
        setImageFiles([]);
        setImagePreviews([]);
        navigate("/admin");
      } else {
        toast.error(data.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product");
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
          <button onClick={() => navigate("/admin")}>
            ← Back to Dashboard
          </button>
        </nav>
      </div>

      <div className="admin-content">
        <div className="admin-header">
          <h1>Add New Product</h1>
          <p>Create a new saree product listing</p>
        </div>

        <div className="add-product-form">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Product Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter product name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="price">Price (₹) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="1"
                  placeholder="Enter price"
                />
              </div>

              <div className="form-group">
                <label htmlFor="discountPrice">Discount Price (₹)</label>
                <input
                  type="number"
                  id="discountPrice"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  placeholder="Enter discounted price (optional)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="stock">Stock Quantity *</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="Enter stock quantity"
                />
              </div>

              <div className="form-group">
                <label htmlFor="material">Material</label>
                <input
                  type="text"
                  id="material"
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                  placeholder="e.g., Pure Silk, Cotton, etc."
                />
              </div>

              <div className="form-group">
                <label htmlFor="color">Color</label>
                <input
                  type="text"
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="e.g., Golden, Red, Blue, etc."
                />
              </div>

              <div className="form-group">
                <label htmlFor="weaveType">Weave Type</label>
                <input
                  type="text"
                  id="weaveType"
                  name="weaveType"
                  value={formData.weaveType}
                  onChange={handleChange}
                  placeholder="e.g., Handloom, Machine woven, etc."
                />
              </div>
            </div>

            <div className="form-group">
              <div className="image-upload-section">
                <div className="image-upload-controls">
                  <label htmlFor="images">Product Images</label>
                  <input
                    type="file"
                    id="images"
                    name="images"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={uploading}
                  />
                  <button
                    type="button"
                    className="btn-select-server-images"
                    onClick={() => setShowImageSelector(true)}
                    disabled={uploading}
                  >
                    Select from Server
                  </button>
                </div>
                {uploading && <p className="upload-status">Uploading images...</p>}
              </div>
            </div>

            {imagePreviews.length > 0 && (
              <div className="image-previews">
                <h4>Image Previews:</h4>
                <div className="preview-grid">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="preview-item">
                      <img src={preview} alt={`Preview ${index + 1}`} />
                      <button
                        type="button"
                        className="remove-image"
                        onClick={() => removeImagePreview(index)}
                        disabled={uploading}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Image Selector Modal */}
            {showImageSelector && (
              <ImageSelector
                selectedImages={selectedImages}
                onImagesChange={setSelectedImages}
                onClose={() => setShowImageSelector(false)}
                maxImages={10}
                imageType="products"
              />
            )}

            <div className="form-group">
              <label htmlFor="shortDescription">Short Description</label>
              <textarea
                id="shortDescription"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                rows="3"
                placeholder="Brief product description (200 characters max)"
                maxLength="200"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Full Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                required
                placeholder="Detailed product description"
              />
            </div>

            <div className="form-group">
              <label htmlFor="careInstructions">Care Instructions</label>
              <textarea
                id="careInstructions"
                name="careInstructions"
                value={formData.careInstructions}
                onChange={handleChange}
                rows="3"
                placeholder="Care and maintenance instructions"
              />
            </div>

            <div className="form-group">
              <label htmlFor="tags">Tags (comma separated)</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g., wedding, traditional, gold, silk"
              />
            </div>

            <div className="form-checkboxes">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="customizable"
                  checked={formData.customizable}
                  onChange={handleChange}
                />
                Customizable
              </label>
              
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                />
                Featured Product
              </label>
              
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="newArrival"
                  checked={formData.newArrival}
                  onChange={handleChange}
                />
                New Arrival
              </label>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate("/admin")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-submit"
                disabled={loading || uploading}
              >
                {loading ? "Adding Product..." : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;