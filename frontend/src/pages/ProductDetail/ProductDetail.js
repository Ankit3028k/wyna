import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import API_CONFIG from "../../config/api";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  // const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          API_CONFIG.buildUrl(`${API_CONFIG.ENDPOINTS.PRODUCTS}/${id}`)
        );
        if (res.data.success) {
          setProduct(res.data.data);
          setActiveImage(res.data.data.images?.[0]?.url);
        }
      } catch (err) {
        toast.error("Failed to load product");
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <p className="loading">Loading...</p>;

  return (
    <div className="product-page">
      <div className="product-wrapper">
        
        {/* IMAGE GALLERY */}
        <div className="image-section">
          <div className="thumbnail-column">
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={`${API_CONFIG.BASE_URL}${img.url}`}
                alt=""
                className={activeImage === img.url ? "thumb active" : "thumb"}
                onClick={() => setActiveImage(img.url)}
              />
            ))}
          </div>

          <div className="main-image">
            <img
              src={`${API_CONFIG.BASE_URL}${activeImage}`}
              alt={product.name}
            />
          </div>
        </div>

        {/* PRODUCT INFO */}
        <div className="info-section">
          <h1>{product.name}</h1>
          <p className="price">₹{product.price.toLocaleString()}</p>

          <p className="description">{product.description}</p>

          <p className="disclaimer">
            *Product color may slightly vary due to lighting and screen settings
          </p>

          {/* QUANTITY */}
          <div className="qty-box">
            <label>Select Quantity:</label>
            <input
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
            />
          </div>

          {/* TOTAL */}
          <div className="total-box">
            <span>Total:</span>
            <strong>₹{(product.price * qty).toLocaleString()}</strong>
          </div>

          <button
            className="add-btn"
            onClick={() => {
              // Add to cart functionality
              const cart = JSON.parse(localStorage.getItem("cart") || "[]");
              
              // Check if product already exists in cart
              const existingItemIndex = cart.findIndex(item => item._id === product._id);
              
              if (existingItemIndex > -1) {
                // Update quantity if item already exists
                cart[existingItemIndex].quantity += qty;
              } else {
                // Add new item with selected quantity
                cart.push({ 
                  ...product, 
                  image: product.images && product.images.length > 0 
                    ? `${API_CONFIG.BASE_URL}${product.images[0].url}` 
                    : "/images/placeholder.jpg",
                  quantity: qty 
                });
              }
              
              localStorage.setItem("cart", JSON.stringify(cart));
              toast.success(`${product.name} added to cart!`);
            }}
          >
            <i className="fas fa-shopping-cart"></i> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;