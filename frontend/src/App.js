import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AdminAuthProvider, useAdminAuth } from "./contexts/AdminAuthContext";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Products from "./pages/Products/Products";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import SeriesHandcrafted from "./pages/SeriesHandcrafted/SeriesHandcrafted";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import ShippingPolicy from "./pages/ShippingPolicy/ShippingPolicy";
import ReturnExchangePolicy from "./pages/ReturnExchangePolicy/ReturnExchangePolicy";
import TermsOfService from "./pages/TermsOfService/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminRegister from "./pages/Admin/AdminRegister";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AddProduct from "./pages/Admin/AddProduct";
import EditProduct from "./pages/Admin/EditProduct";
import AddCategory from "./pages/Admin/AddCategory";
import EditCategory from "./pages/Admin/EditCategory";
import FirstVisitConfetti from "./components/FirstVisitConfetti/FirstVisitConfetti";
import ScrollProgress from "./components/ScrollProgress/ScrollProgress";
import WhatsAppChat from "./components/WhatsAppChat/WhatsAppChat";
import "./App.css";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAdminAuth();
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

// Public Route Component (redirects authenticated users)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAdminAuth();
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  return !isAuthenticated ? children : <Navigate to="/admin" />;
};

function App() {
  return (
    <AdminAuthProvider>
      <Router>
        <div className="App">
          <ScrollProgress />
          <FirstVisitConfetti />
          <WhatsAppChat />
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/categories/:slug" element={<Products />} />
              <Route path="/series/handcrafted" element={<SeriesHandcrafted />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/shipping" element={<ShippingPolicy />} />
              <Route path="/return-exchange" element={<ReturnExchangePolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              {/* Admin Routes */}
              <Route 
                path="/admin/login" 
                element={
                  <PublicRoute>
                    <AdminLogin />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/admin/register" 
                element={
                  <PublicRoute>
                    <AdminRegister />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/products/add" 
                element={
                  <ProtectedRoute>
                    <AddProduct />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/products/edit/:productId" 
                element={
                  <ProtectedRoute>
                    <EditProduct />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/categories/add" 
                element={
                  <ProtectedRoute>
                    <AddCategory />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/categories/edit/:categoryId" 
                element={
                  <ProtectedRoute>
                    <EditCategory />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#363636",
                color: "#fff",
              },
            }}
          />
        </div>
      </Router>
    </AdminAuthProvider>
  );
}

export default App;
