import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../contexts/AdminAuthContext";
import toast from "react-hot-toast";
import API_CONFIG from "../../config/api";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { admin, logout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });

  const fetchData = React.useCallback(async (token = null) => {
    try {
      const headers = token 
        ? { "Authorization": `Bearer ${token}` }
        : {};
      
      // Fetch products
      const productsRes = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.PRODUCTS), {
        headers
      });
      const productsData = await productsRes.json();
      setProducts(productsData.data || []);

      // Fetch admin orders (using admin endpoint)
      const ordersRes = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.ORDERS_ADMIN_ALL), {
        headers
      });
      const ordersData = await ordersRes.json();
      const ordersList = ordersData.data || [];
      setOrders(ordersList);

      // Fetch categories
      const categoriesRes = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.CATEGORIES), {
        headers
      });
      const categoriesData = await categoriesRes.json();
      setCategories(categoriesData.data || []);

      // Calculate stats
      const totalRevenue = ordersList.reduce(
        (sum, order) => sum + (order.totalAmount || 0),
        0
      );
      const pendingOrders = ordersList.filter(
        (order) => order.orderStatus === "pending"
      ).length;

      setStats({
        totalProducts: productsData.data?.length || 0,
        totalOrders: ordersList.length,
        totalRevenue: totalRevenue,
        pendingOrders: pendingOrders,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load dashboard data. Please login again.");
      // Redirect to login if auth fails
      if (token) {
        logout();
        navigate("/admin/login");
      }
    }
  }, [logout, navigate]);

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }
    fetchData(token);
  }, [fetchData, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const renderOverview = () => (
    <div className="overview-section">
      <h2>Dashboard Overview</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>{stats.totalProducts}</h3>
            <p>Total Products</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🛍️</div>
          <div className="stat-info">
            <h3>{stats.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>₹{stats.totalRevenue.toLocaleString()}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>{stats.pendingOrders}</h3>
            <p>Pending Orders</p>
          </div>
        </div>
      </div>

      <div className="recent-section">
        <h3>Recent Orders</h3>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order._id}>
                  <td>{order.orderNumber || '#' + order._id.slice(-8)}</td>
                  <td>{order.shippingAddress?.fullName || "N/A"}</td>
                  <td>₹{order.totalAmount.toLocaleString()}</td>
                  <td>
                    <span className={`status-badge status-${order.orderStatus}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="products-section">
      <div className="section-header">
        <h2>Product Management</h2>
        <button
          className="btn-add"
          onClick={() => navigate("/admin/products/add")}
        >
          + Add New Product
        </button>
      </div>
      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>
                  <img
                    src={product.images?.[0]?.url || "/Asset/product/placeholder.jpg"}
                    alt={product.name}
                    className="product-thumb"
                  />
                </td>
                <td>{product.name}</td>
                <td>{product.category?.name || "N/A"}</td>
                <td>₹{product.finalPrice?.toLocaleString() || product.price?.toLocaleString()}</td>
                <td>{product.stock}</td>
                <td>
                  <span className={`status-badge status-${product.status || "draft"}`}>
                    {product.status || "draft"}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn-edit" 
                    onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-delete" 
                    onClick={() => deleteProduct(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="orders-section">
      <h2>Order Management</h2>
      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.orderNumber || '#' + order._id.slice(-8)}</td>
                <td>{order.shippingAddress?.fullName || "N/A"}</td>
                <td>{order.user?.email || "N/A"}</td>
                <td>₹{order.totalAmount.toLocaleString()}</td>
                <td>
                  <select
                    className="status-select"
                    value={order.orderStatus}
                    onChange={(e) =>
                      updateOrderStatus(order._id, e.target.value)
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="btn-view">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("adminToken");
      const headers = {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` })
      };
      
      await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.ORDERS_ADMIN_STATUS(orderId)), {
        method: "PUT",
        headers,
        body: JSON.stringify({ status: newStatus }),
      });
      fetchData(token);
      toast.success("Order status updated successfully");
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order status");
    }
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
    
    try {
      const token = localStorage.getItem("adminToken");
      const headers = {
        ...(token && { "Authorization": `Bearer ${token}` })
      };
      
      const response = await fetch(API_CONFIG.buildUrl(`${API_CONFIG.ENDPOINTS.PRODUCTS}/${productId}`), {
        method: "DELETE",
        headers
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Product deleted successfully");
        fetchData(token);
      } else {
        toast.error(data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const deleteCategory = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }
    
    try {
      const token = localStorage.getItem("adminToken");
      const headers = {
        ...(token && { "Authorization": `Bearer ${token}` })
      };
      
      const response = await fetch(API_CONFIG.buildUrl(`${API_CONFIG.ENDPOINTS.CATEGORIES}/${categoryId}`), {
        method: "DELETE",
        headers
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Category deleted successfully");
        fetchData(token);
      } else {
        toast.error(data.message || "Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
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
          <button
            className={activeTab === "overview" ? "active" : ""}
            onClick={() => setActiveTab("overview")}
          >
            📊 Overview
          </button>
          <button
            className={activeTab === "products" ? "active" : ""}
            onClick={() => setActiveTab("products")}
          >
            📦 Products
          </button>
          <button
            className={activeTab === "orders" ? "active" : ""}
            onClick={() => setActiveTab("orders")}
          >
            🛍️ Orders
          </button>
          <button
            className={activeTab === "categories" ? "active" : ""}
            onClick={() => setActiveTab("categories")}
          >
            🏷️ Categories
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </nav>
      </div>

      <div className="admin-content">
        <div className="admin-header">
          <div>
            <h1>Welcome to WYNA Admin Panel</h1>
            <p>Welcome back, {admin?.name || "Admin"}</p>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {activeTab === "overview" && renderOverview()}
        {activeTab === "products" && renderProducts()}
        {activeTab === "orders" && renderOrders()}
        {activeTab === "categories" && (
          <div className="categories-section">
            <div className="section-header">
              <h2>Category Management</h2>
              <button
                className="btn-add"
                onClick={() => navigate("/admin/categories/add")}
              >
                + Add New Category
              </button>
            </div>
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Featured</th>
                    <th>Active</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category._id}>
                      <td><strong>{category.name}</strong></td>
                      <td>{category.description?.substring(0, 100)}...</td>
                      <td>
                        <span className={`status-badge ${category.featured ? 'status-processing' : 'status-pending'}`}>
                          {category.featured ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${category.active ? 'status-delivered' : 'status-cancelled'}`}>
                          {category.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn-edit" 
                          onClick={() => navigate(`/admin/categories/edit/${category._id}`)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn-delete" 
                          onClick={() => deleteCategory(category._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
