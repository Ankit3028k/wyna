import React from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import "./Home.css";
import API_CONFIG from "../../config/api";
import AuraWeaver from "../../components/AuraWeaver/AuraWeaver";
import InstagramLightbox from "../../components/InstagramLightbox/InstagramLightbox";
// import ApiTest from "../../components/ApiTest/ApiTest";
// import WeaveAssistant from "../../components/WeaveAssistant/WeaveAssistant";
// import AnimatedHero from "../../components/AnimatedHero/AnimatedHero";
import ImageSlider from "../../components/ImageSlider/ImageSlider";

const Home = () => {
  const [isLightboxOpen, setIsLightboxOpen] = React.useState(false);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  const instagramImages = [
    {
      src: "/Asset/11.png",
      alt: "WYNA on Instagram",
      likes: "1.2k likes",
    },
    {
      src: "/Asset/12.png",
      alt: "WYNA on Instagram",
      likes: "987 likes",
    },
    {
      src: "/Asset/13.png",
      alt: "WYNA on Instagram",
      likes: "1.5k likes",
    },
    {
      src: "/Asset/14.png",
      alt: "WYNA on Instagram",
      likes: "756 likes",
    },
    {
      src: "/Asset/11.png",
      alt: "WYNA on Instagram",
      likes: "892 likes",
    },
    {
      src: "/Asset/13.png",
      alt: "WYNA on Instagram",
      likes: "1.1k likes",
    },
  ];

  // const openLightbox = (index) => {
  //   setCurrentImageIndex(index);
  //   setIsLightboxOpen(true);
  //   document.body.style.overflow = "hidden";
  // };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    document.body.style.overflow = "unset";
  };
  const [featuredProducts, setFeaturedProducts] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Debug URL construction
        API_CONFIG.debugUrlConstruction();
        
        console.log('Fetching from API URL:', API_CONFIG.BASE_URL);
        console.log('Products endpoint:', API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.PRODUCTS_FEATURED));
        console.log('Categories endpoint:', API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.CATEGORIES_FEATURED));
        
        // Fetch featured products
        const productsResponse = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.PRODUCTS_FEATURED));
        
        if (!productsResponse.ok) {
          throw new Error(`Products API failed with status ${productsResponse.status}: ${productsResponse.statusText}`);
        }
        
        const productsData = await productsResponse.json();
        console.log('Products data received:', productsData);
        
        // Fetch categories
        const categoriesResponse = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.CATEGORIES_FEATURED));
        
        if (!categoriesResponse.ok) {
          throw new Error(`Categories API failed with status ${categoriesResponse.status}: ${categoriesResponse.statusText}`);
        }
        
        const categoriesData = await categoriesResponse.json();
        console.log('Categories data received:', categoriesData);
        
        // Transform data for frontend
        const transformedProducts = productsData.data.map(product => ({
          id: product._id,
          name: product.name,
          price: `₹${product.finalPrice.toLocaleString()}`,
          image: product.images[0]?.url || "/Asset/product/placeholder.jpg",
          description: product.shortDescription || product.description,
          series: "Featured",
          exclusive: product.featured
        }));
        
        const transformedCategories = categoriesData.data.map(category => ({
          name: category.name,
          image: category.image || "/Asset/product/placeholder.jpg",
          description: category.description,
          count: 0 // Would need to fetch product counts per category
        }));
        
        setFeaturedProducts(transformedProducts);
        setCategories(transformedCategories);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        console.error("Full error details:", {
          message: error.message,
          stack: error.stack,
          apiUrl: API_CONFIG.BASE_URL,
          productsEndpoint: API_CONFIG.ENDPOINTS.PRODUCTS_FEATURED,
          categoriesEndpoint: API_CONFIG.ENDPOINTS.CATEGORIES_FEATURED
        });
        // Show user-friendly error message
        toast.error("Failed to load products. Please try again later.");
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="home">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading exquisite collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Image Slider Section */}
      <ImageSlider />

      {/* Enhanced Hero Section */}
      {/* <AnimatedHero /> */}

      {/* Categories Section */}
      <section className="categories section-separator animate-fade-in-up">
        <div className="container">
          <h2 className="section-title">Exclusive Series</h2>
          <p className="section-subtitle">
            Discover our curated collections of premium traditional sarees
          </p>

          <div className="categories-grid stagger-animation">
            {categories.map((category, index) => (
              <div key={index} className="category-card card hover-lift">
                <div className="category-image">
                  <img src={category.image} alt={category.name} />
                  <div className="category-overlay">
                    <Link
                      to={`/categories/${category.name.toLowerCase()}`}
                      className="btn btn-primary"
                    >
                      View All
                    </Link>
                  </div>
                </div>
                <div className="card-body">
                  <h3 className="card-title">{category.name}</h3>
                  <p className="card-text">{category.description}</p>
                  <p className="card-count">
                    {category.count} {category.count === 1 ? "saree" : "sarees"}{" "}
                    available
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products section-separator-wave animate-fade-in-up">
        <div className="container">
          <h2 className="section-title">Series: Handcrafted</h2>
          <p className="section-subtitle">
            11 exquisite variants • 47 unique articles • No repetition, no
            identical combinations
          </p>

          <div className="products-grid stagger-animation">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to="/products#our-exquisite-collection"
                className="product-card card hover-lift"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  <div className="product-badges">
                    {product.exclusive && (
                      <span className="badge badge-exclusive">Exclusive</span>
                    )}
                    {/* <span className="badge badge-series">{product.series}</span> */}
                  </div>
                </div>
                <div className="card-body">
                  <h3 className="card-title">{product.name}</h3>
                  <p className="card-text">{product.description}</p>
                  <div className="product-footer">
                    <span className="price">{product.price}</span>
                    <span className="btn btn-outline">View Details</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-5">
            <Link
              to="/series/handcrafted"
              className="btn btn-primary btn-large hover-scale"
            >
              Explore Series
              <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features animate-fade-in-up">
        <div className="container">
          <h2 className="section-title">The WYNA Philosophy</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-gem"></i>
              </div>
              <h3>One-of-a-Kind</h3>
              <p>
                No repeated sarees, no identical color combinations. Every piece
                carries its own identity.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-crown"></i>
              </div>
              <h3>Curated Tradition</h3>
              <p>
                Series-based limited collections. Luxury at WYNA is intentional
                and rare.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-hand-sparkles"></i>
              </div>
              <h3>Handcrafted Excellence</h3>
              <p>
                Traditional weaving techniques passed down through generations
                of master craftsmen.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-certificate"></i>
              </div>
              <h3>Authentic Heritage</h3>
              <p>
                Under Shrinaya Parampara (Since 2025), founded by Mrs. Garima
                Singh.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-us animate-fade-in-up">
        <div className="container">
          <h2 className="section-title">Why Choose WYNA</h2>
          <p className="section-subtitle">
            Experience luxury that goes beyond just fabric and threads
          </p>
          <div className="why-grid">
            <div className="why-item">
              <div className="why-number">01</div>
              <div className="why-content">
                <h3>Premium Quality Silk</h3>
                <p>
                  Only the finest pure silk sourced from Banaras, known for its
                  lustrous sheen and durability.
                </p>
              </div>
            </div>
            <div className="why-item">
              <div className="why-number">02</div>
              <div className="why-content">
                <h3>Artisan Collaboration</h3>
                <p>
                  We work directly with master weavers, ensuring fair wages and
                  preserving traditional craftsmanship.
                </p>
              </div>
            </div>
            <div className="why-item">
              <div className="why-number">03</div>
              <div className="why-content">
                <h3>Limited Edition Series</h3>
                <p>
                  Each series is carefully curated with limited quantities,
                  ensuring exclusivity for our customers.
                </p>
              </div>
            </div>
            <div className="why-item">
              <div className="why-number">04</div>
              <div className="why-content">
                <h3>Quality Assurance</h3>
                <p>
                  Every saree undergoes rigorous quality checks before reaching
                  you, with authentication certificates.
                </p>
              </div>
            </div>
            <div className="why-item">
              <div className="why-number">05</div>
              <div className="why-content">
                <h3>Lifetime Support</h3>
                <p>
                  Get expert care instructions and lifetime assistance for your
                  treasured WYNA saree.
                </p>
              </div>
            </div>
            <div className="why-item">
              <div className="why-number">06</div>
              <div className="why-content">
                <h3>Secure Shipping</h3>
                <p>
                  Premium packaging with insurance and tracking for safe
                  delivery across India and worldwide.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works animate-fade-in-up">
        <div className="container">
          <h2 className="section-title">Your Journey to Elegance</h2>
          <p className="section-subtitle">
            From selection to delivery - experience seamless luxury shopping
          </p>
          <div className="steps-container">
            <div className="step-item">
              <div className="step-icon">
                <i className="fas fa-search"></i>
              </div>
              <div className="step-content">
                <h3>Explore Collections</h3>
                <p>
                  Browse our curated series and discover your perfect saree from
                  our exclusive collections.
                </p>
              </div>
              <div className="step-arrow">
                <i className="fas fa-arrow-right"></i>
              </div>
            </div>
            <div className="step-item">
              <div className="step-icon">
                <i className="fas fa-palette"></i>
              </div>
              <div className="step-content">
                <h3>Customize Your Aura</h3>
                <p>
                  Use our Aura Weaver tool to visualize and personalize your
                  saree design preferences.
                </p>
              </div>
              <div className="step-arrow">
                <i className="fas fa-arrow-right"></i>
              </div>
            </div>
            <div className="step-item">
              <div className="step-icon">
                <i className="fas fa-shopping-cart"></i>
              </div>
              <div className="step-content">
                <h3>Easy Checkout</h3>
                <p>
                  Secure payment options with multiple gateways and hassle-free
                  order placement.
                </p>
              </div>
              <div className="step-arrow">
                <i className="fas fa-arrow-right"></i>
              </div>
            </div>
            <div className="step-item">
              <div className="step-icon">
                <i className="fas fa-gift"></i>
              </div>
              <div className="step-content">
                <h3>Luxury Packaging</h3>
                <p>
                  Receive your saree in premium packaging with authentication
                  certificate and care instructions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Aura Weaver Interactive Tool */}
      <section className="aura-weaver-section animate-fade-in-up">
        <div className="container">
          <AuraWeaver />
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter animate-fade-in-up">
        <div className="container">
          <div className="newsletter-content">
            <h2>Embrace Your Aura</h2>
            <p>
              Receive exclusive updates about new series and limited edition
              collections
            </p>
            <form className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email address"
                className="newsletter-input"
              />
              <button type="submit" className="btn btn-primary">
                Join WYNA
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Instagram Lightbox */}
      <InstagramLightbox
        images={instagramImages}
        isOpen={isLightboxOpen}
        onClose={closeLightbox}
        currentIndex={currentImageIndex}
        setCurrentIndex={setCurrentImageIndex}
      />

      {/* API Test Component - Debug */}
      {/* <ApiTest /> */}

      {/* Weave Assistant */}
      {/* <WeaveAssistant /> */}
    </div>
  );
};

export default Home;
