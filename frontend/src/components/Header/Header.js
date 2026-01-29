import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { FaShoppingCart } from "react-icons/fa";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <img src="/Asset/logo.jpeg" className="logo-img" alt="WYNA Logo" />
            <span className="logo-text">WYNA</span>
          </Link>

          {/* Search Bar */}
          <div
            className={`search-container ${searchOpen ? "search-open" : ""}`}
          >
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Search for exquisite sarees..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-btn">
                <i className="fas fa-search"></i>
              </button>
            </form>
          </div>

          <button
            className="search-toggle"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <i className="fas fa-search"></i>
          </button>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <nav className={`nav ${mobileMenuOpen ? "mobile-open" : ""}`}>
            <div className="nav-item products-dropdown">
              <Link to="/products" onClick={() => setMobileMenuOpen(false)}>
                Products <i className="fas fa-chevron-down"></i>
              </Link>
            </div>

            <Link
              to="/"
              className="nav-item"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="nav-item"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="nav-item"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              to="/cart"
              className="nav-item cart-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="cart-icon">
                <FaShoppingCart />
              </span>{" "}
              Cart
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
