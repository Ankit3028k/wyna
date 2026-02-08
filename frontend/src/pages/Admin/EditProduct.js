import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import ImageSelector from '../../components/Admin/ImageSelector';
import API_CONFIG from "../../config/api";
import "./AdminDashboard.css";

const EditProduct = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productLoading, setProductLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  // const [productDataFromServer, setProductDataFromServer] = useState(null);
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
    newArrival: false,
    status: "published"
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.CATEGORIES));
        const data = await response.json();
        setCategories(data.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      }
    };

    const fetchProduct = async () => {
      try {
        const response = await fetch(API_CONFIG.buildUrl(`${API_CONFIG.ENDPOINTS.PRODUCTS}/${productId}`));
        const data = await response.json();
        
        if (data.success) {
          const product = data.data;
          // setProductDataFromServer(product); // Store original product data
          
          // Set selected images from the existing product images
          if (product.images && product.images.length > 0) {
            setSelectedImages(product.images.map(img => ({
              url: img.url,
              alt: img.alt || "Product image",
              isPrimary: img.isPrimary || false
            })));
          }
          
          setFormData({
            name: product.name || "",
            description: product.description || "",
            shortDescription: product.shortDescription || "",
            price: product.price || "",
            discountPrice: product.discountPrice || "",
            category: product.category?._id || "",
            stock: product.stock || "",
            material: product.material || "",
            weaveType: product.weaveType || "",
            color: product.color || "",
            pattern: product.pattern || "",
            length: product.length || "",
            width: product.width || "",
            weight: product.weight || "",
            careInstructions: product.careInstructions || "",
            tags: product.tags?.join(", ") || "",
            customizable: product.customizable || false,
            featured: product.featured || false,
            newArrival: product.newArrival || false,
            status: product.status || "published"
          });
        } else {
          toast.error("Product not found");
          navigate("/admin");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product");
        navigate("/admin");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    if (productId) {
      fetchProduct();
    } else {
      setLoading(false);
    }
  }, [productId, navigate]);

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
    setProductLoading(true);
    
    try {
      const token = localStorage.getItem("adminToken");
      
      // Upload images first (this also handles selected server images)
      const uploadedImages = await uploadImages();
      
      // Prepare product data
      const productData = {
        ...formData,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
        stock: Number(formData.stock),
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
        images: uploadedImages // Use the combined images from uploadImages function
      };
      
      const response = await fetch(API_CONFIG.buildUrl(`${API_CONFIG.ENDPOINTS.PRODUCTS}/${productId}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Product updated successfully!");
        navigate("/admin");
      } else {
        toast.error(data.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    } finally {
      setProductLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return;
    }
    
    try {
      const token = localStorage.getItem("adminToken");
      
      const response = await fetch(API_CONFIG.buildUrl(`${API_CONFIG.ENDPOINTS.PRODUCTS}/${productId}`), {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Product deleted successfully!");
        navigate("/admin");
      } else {
        toast.error(data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
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
            <p>Loading product...</p>
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
          <button onClick={() => navigate("/admin")}>
            ← Back to Dashboard
          </button>
        </nav>
      </div>

      <div className="admin-content">
        <div className="admin-header">
          <h1>Edit Product</h1>
          <p>Update product details</p>
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
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
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

              <div className="form-group">
                <label htmlFor="pattern">Pattern</label>
                <input
                  type="text"
                  id="pattern"
                  name="pattern"
                  value={formData.pattern}
                  onChange={handleChange}
                  placeholder="e.g., Floral, Geometric, etc."
                />
              </div>

              <div className="form-group">
                <label htmlFor="length">Length</label>
                <input
                  type="text"
                  id="length"
                  name="length"
                  value={formData.length}
                  onChange={handleChange}
                  placeholder="e.g., 5.5 meters"
                />
              </div>

              <div className="form-group">
                <label htmlFor="width">Width</label>
                <input
                  type="text"
                  id="width"
                  name="width"
                  value={formData.width}
                  onChange={handleChange}
                  placeholder="e.g., 44 inches"
                />
              </div>

              <div className="form-group">
                <label htmlFor="weight">Weight</label>
                <input
                  type="text"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="e.g., Lightweight, Medium, Heavy"
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

            {(imagePreviews.length > 0 || selectedImages.length > 0) && (
              <div className="image-previews">
                <h4>Selected Images:</h4>
                <div className="preview-grid">
                  {/* Show newly uploaded previews */}
                  {imagePreviews.map((preview, index) => (
                    <div key={`upload-${index}`} className="preview-item">
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
                  {/* Show selected server images */}
                  {selectedImages.map((image, index) => (
                    <div key={`server-${index}`} className="preview-item">
                      <img src={`${API_CONFIG.BASE_URL}${image.url}`} alt={image.alt} />
                      <button
                        type="button"
                        className="remove-image"
                        onClick={() => {
                          const newSelected = [...selectedImages];
                          newSelected.splice(index, 1);
                          setSelectedImages(newSelected);
                        }}
                        disabled={uploading}
                      >
                        ×
                      </button>
                      {image.isPrimary && <span className="primary-indicator">★</span>}
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
                type="button"
                className="btn-delete"
                onClick={handleDelete}
                disabled={productLoading}
              >
                Delete Product
              </button>
              <button
                type="submit"
                className="btn-submit"
                disabled={productLoading || uploading}
              >
                {productLoading ? "Updating Product..." : "Update Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;