import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "./SeriesHandcrafted.css";

const SeriesHandcrafted = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/products?category=handcrafted");
        const productsData = Array.isArray(response.data) ? response.data : [];
        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (error) {
        toast.error("Failed to load series products");
        console.error(error);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleFilter = (filterType) => {
    setFilter(filterType);
    const productsArray = Array.isArray(products) ? products : [];
    if (filterType === "all") {
      setFilteredProducts(productsArray);
    } else if (filterType === "exclusive") {
      setFilteredProducts(
        productsArray.filter((p) => p.exclusive || p.isExclusive)
      );
    } else if (filterType === "price-low") {
      setFilteredProducts([...productsArray].sort((a, b) => a.price - b.price));
    } else if (filterType === "price-high") {
      setFilteredProducts([...productsArray].sort((a, b) => b.price - a.price));
    }
  };

  if (loading) {
    return (
      <div className="series-loading">
        <div className="spinner"></div>
        <p>Loading Series: Handcrafted...</p>
      </div>
    );
  }

  const safeFilteredProducts = Array.isArray(filteredProducts)
    ? filteredProducts
    : [];

  return (
    <div className="series-handcrafted">
      {/* Hero Section */}
      <div className="series-hero">
        <div className="series-hero-overlay"></div>
        <div className="container">
          <div className="series-hero-content">
            <span className="series-badge">Exclusive Series</span>
            <h1 className="series-title">Series: Handcrafted</h1>
            <p className="series-tagline">
              11 Exquisite Variants • 47 Unique Articles • Timeless Elegance
            </p>
            <p className="series-description">
              Discover our flagship collection of premium handwoven sarees
              crafted with traditional techniques and finest silk. Each piece is
              a masterpiece of artistry, combining heritage with contemporary
              aesthetics.
            </p>
            <div className="series-stats">
              <div className="stat-item">
                <span className="stat-number">47</span>
                <span className="stat-label">Unique Pieces</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">11</span>
                <span className="stat-label">Variants</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Authentic</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="series-filters">
        <div className="container">
          <div className="filter-wrapper">
            <h3 className="filter-title">Refine Your Search</h3>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${filter === "all" ? "active" : ""}`}
                onClick={() => handleFilter("all")}
              >
                <i className="fas fa-th"></i> All Products
              </button>
              <button
                className={`filter-btn ${
                  filter === "exclusive" ? "active" : ""
                }`}
                onClick={() => handleFilter("exclusive")}
              >
                <i className="fas fa-crown"></i> Exclusive Only
              </button>
              <button
                className={`filter-btn ${
                  filter === "price-low" ? "active" : ""
                }`}
                onClick={() => handleFilter("price-low")}
              >
                <i className="fas fa-arrow-up"></i> Price: Low to High
              </button>
              <button
                className={`filter-btn ${
                  filter === "price-high" ? "active" : ""
                }`}
                onClick={() => handleFilter("price-high")}
              >
                <i className="fas fa-arrow-down"></i> Price: High to Low
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="series-content">
        <div className="container">
          {safeFilteredProducts.length === 0 ? (
            <div className="no-products">
              <i className="fas fa-search"></i>
              <h3>No Products Found</h3>
              <p>No products match your current filter selection.</p>
              <button className="btn-reset" onClick={() => handleFilter("all")}>
                View All Products
              </button>
            </div>
          ) : (
            <>
              <div className="products-count">
                Showing <strong>{safeFilteredProducts.length}</strong> of{" "}
                <strong>{products.length}</strong> products
              </div>
              <div className="series-products-grid">
                {safeFilteredProducts.map((product) => (
                  <Link
                    to={`/products/${product._id}`}
                    key={product._id}
                    className="series-product-card"
                  >
                    <div className="product-image-wrapper">
                      <img
                        src={product.image || "/images/placeholder.jpg"}
                        alt={product.name}
                        className="product-image"
                      />
                      {product.exclusive || product.isExclusive ? (
                        <span className="exclusive-badge">Exclusive</span>
                      ) : null}
                      <div className="product-overlay">
                        <button className="view-details-btn">
                          <i className="fas fa-eye"></i> View Details
                        </button>
                      </div>
                    </div>
                    <div className="product-details">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-description">
                        {product.description?.substring(0, 50)}...
                      </p>
                      <div className="product-meta">
                        <span className="price">₹{product.price}</span>
                        <span className="rating">
                          <i className="fas fa-star"></i> 4.8 (128)
                        </span>
                      </div>
                      <button className="add-to-cart-btn">
                        <i className="fas fa-shopping-cart"></i> Add to Cart
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Info Section */}
      <section className="series-info">
        <div className="container">
          <h2 className="section-title">About This Series</h2>
          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon">
                <i className="fas fa-hands"></i>
              </div>
              <h4>Handcrafted Excellence</h4>
              <p>
                Each saree is meticulously handwoven by master craftsmen using
                traditional looming techniques passed down through generations.
              </p>
            </div>
            <div className="info-card">
              <div className="info-icon">
                <i className="fas fa-gem"></i>
              </div>
              <h4>Premium Silk</h4>
              <p>
                We source only the finest pure silk from Banaras, known for its
                lustrous sheen, softness, and exceptional durability.
              </p>
            </div>
            <div className="info-card">
              <div className="info-icon">
                <i className="fas fa-certificate"></i>
              </div>
              <h4>Authentic Zari Work</h4>
              <p>
                Genuine gold and silver zari embellishments create intricate
                patterns and designs unique to each piece.
              </p>
            </div>
            <div className="info-card">
              <div className="info-icon">
                <i className="fas fa-infinity"></i>
              </div>
              <h4>Timeless Collection</h4>
              <p>
                Our Handcrafted series represents the pinnacle of traditional
                weaving artistry, perfect for celebrations and special
                occasions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="series-cta">
        <div className="container">
          <h2>Need Help Choosing?</h2>
          <p>
            Let our experts guide you to find the perfect saree from this
            exclusive series.
          </p>
          <div className="cta-buttons">
            <button className="btn-primary">
              <i className="fas fa-headset"></i> Chat with Expert
            </button>
            <Link to="/contact" className="btn-secondary">
              <i className="fas fa-envelope"></i> Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SeriesHandcrafted;
