import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import API_CONFIG from "../../config/api";
// import axios from "axios";
import toast from "react-hot-toast";
import "./Products.css";


const Products = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [limit] = useState(12);

  useEffect(() => {
    // Reset to page 1 when search query or slug changes
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, [searchQuery, slug]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let apiUrl = API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.PRODUCTS);
        
        // Add category filter if slug exists
        if (slug) {
          apiUrl += `?category=${slug}`;
        }
        
        // Add search query if exists
        if (searchQuery) {
          const separator = apiUrl.includes('?') ? '&' : '?';
          apiUrl += `${separator}search=${searchQuery}`;
        }
        
        // Add pagination parameters
        const pageSeparator = apiUrl.includes('?') ? '&' : '?';
        apiUrl += `${pageSeparator}page=${pagination.currentPage}&limit=${limit}`;
        
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        // Check if response is successful
        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch products');
        }
        
        // Transform data for frontend
        const transformedProducts = data.data.map(product => ({
          _id: product._id,
          name: product.name,
          price: product.finalPrice,
          category: typeof product.category === 'object' ? (product.category?.name || "Uncategorized") : product.category || "Uncategorized",
          image: product.images && product.images.length > 0 ? `${product.images[0].url}` : "/Asset/product/placeholder.jpg",
          buyNowButton: true,
          hasDiscount: product.hasDiscount,
          discountPercentage: product.discountPercentage,
          originalPrice: product.price
        }));
        
        setProducts(transformedProducts);
        setFilteredProducts(transformedProducts);
        
        // Set pagination data from response
        if (data.pagination) {
          setPagination(data.pagination);
        } else {
          // Fallback for basic pagination response
          setPagination({
            currentPage: data.currentPage || 1,
            totalPages: data.totalPages || 1,
            totalProducts: data.total || 0,
            hasNextPage: (data.currentPage || 1) < (data.totalPages || 1),
            hasPrevPage: (data.currentPage || 1) > 1
          });
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
        toast.error("Failed to load products");
      }
    };
    
    fetchProducts();
  }, [slug, searchQuery, pagination.currentPage, limit]);

  const handleFilter = (filterType) => {
    setFilter(filterType);
    // Reset to page 1 when filter changes
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    const productsArray = Array.isArray(products) ? products : [];
    if (filterType === "all") {
      setFilteredProducts(productsArray);
    } else if (filterType === "popular") {
      setFilteredProducts(
        productsArray.slice(0, Math.ceil(productsArray.length / 2))
      );
    } else if (filterType === "new") {
      setFilteredProducts(
        productsArray.slice(Math.ceil(productsArray.length / 2))
      );
    }
  };

  // Pagination handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  const handlePrevPage = () => {
    if (pagination.hasPrevPage) {
      setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }));
    }
  };

  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }));
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const { currentPage, totalPages } = pagination;
    const pageNumbers = [];
    
    if (totalPages <= 7) {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show first page, current page, and last page with ellipsis
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  // const handleBuyNow = (product) => {
  //   const phoneNumber = "918744923702"; // Replace with your WhatsApp number with country code, e.g.
  //   const message = `I am interested in buying the product: ${product.name} priced at ₹${product.price}`;
  //   const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
  //     message
  //   )}`;
  //   window.open(url, "_blank");
  // };

  if (loading) {
    return (
      <div className="products-loading">
        <div className="spinner"></div>Loading our exquisite collection...
      </div>
    );
  }

  const safeFilteredProducts = Array.isArray(filteredProducts)
    ? filteredProducts
    : [];

  return (
    <>
      {/* Hero Section */}
      <div className="products-hero">
        <div className="container">
          <h1 className="products-title">Our Exquisite Collection</h1>
          <p className="products-subtitle">
            Discover handcrafted sarees with premium quality and unique designs
          </p>
          
          {/* Search Bar */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Search sarees..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-btn">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="filter-section">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => handleFilter("all")}
          >
            <i className="fas fa-th"></i> All Products
          </button>
          <button
            className={`filter-btn ${filter === "popular" ? "active" : ""}`}
            onClick={() => handleFilter("popular")}
          >
            <i className="fas fa-fire"></i> Popular
          </button>
          <button
            className={`filter-btn ${filter === "new" ? "active" : ""}`}
            onClick={() => handleFilter("new")}
          >
            <i className="fas fa-sparkles"></i> New Arrivals
          </button>
        </div>

        {safeFilteredProducts.length === 0 ? (
          <div className="no-products">
            <i className="fas fa-inbox"></i>
            <p>No products found in this category.</p>
            <Link to="/" className="btn-back">
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="products-grid">
            {safeFilteredProducts.map((product) => (
              <div key={product._id} className="product-card">
                <div
                  className="product-link"
                  onClick={() => navigate(`/products/${product._id}`)}
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <div className="product-image">
                    <img
                      src={product.image}
                      alt={product.name}
                      onError={(e) => {
                        console.error(`Failed to load image: ${product.image}`);
                        e.target.onerror = null; // Prevent infinite loop if placeholder also fails
                        e.target.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='%23e0e0e0'%3E%3Crect width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='10' text-anchor='middle' dominant-baseline='middle' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";
                      }}
                      onLoad={(e) =>
                        console.log(`Successfully loaded: ${product.image}`)
                      }
                    />

                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <div className="product-footer">
                      <div className="price-container">
                        <span className="price">₹{product.price.toLocaleString()}</span>
                        {product.hasDiscount && (
                          <>
                            <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
                            <span className="discount-badge">{product.discountPercentage}% OFF</span>
                          </>
                        )}
                      </div>
                      <span className="category">{product.category?.name || product.category}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering card click
                    // Add to cart functionality
                    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
                    const existingItemIndex = cartItems.findIndex(item => item._id === product._id);
                    
                    if (existingItemIndex > -1) {
                      // Update quantity if item already exists
                      cartItems[existingItemIndex].quantity += 1;
                    } else {
                      // Add new item with quantity 1
                      cartItems.push({
                        ...product,
                        image: product.image, // Use the transformed image URL
                        quantity: 1
                      });
                    }
                    
                    localStorage.setItem('cart', JSON.stringify(cartItems));
                    toast.success(`${product.name} added to cart!`);
                  }}
                  className="btn-add-to-cart"
                >
                  <i className="fas fa-shopping-cart"></i> Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="pagination-container">
            <div className="pagination-info">
              <span>
                Showing {((pagination.currentPage - 1) * limit) + 1} to {Math.min(pagination.currentPage * limit, pagination.totalProducts)} of {pagination.totalProducts} products
              </span>
            </div>
            
            <div className="pagination-controls">
              <button
                className="pagination-btn prev-btn"
                onClick={handlePrevPage}
                disabled={!pagination.hasPrevPage}
              >
                <i className="fas fa-chevron-left"></i> Previous
              </button>
              
              <div className="pagination-numbers">
                {getPageNumbers().map((pageNum, index) => (
                  <span key={index}>
                    {pageNum === '...' ? (
                      <span className="pagination-ellipsis">...</span>
                    ) : (
                      <button
                        className={`pagination-number ${pageNum === pagination.currentPage ? 'active' : ''}`}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    )}
                  </span>
                ))}
              </div>
              
              <button
                className="pagination-btn next-btn"
                onClick={handleNextPage}
                disabled={!pagination.hasNextPage}
              >
                Next <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Products;
