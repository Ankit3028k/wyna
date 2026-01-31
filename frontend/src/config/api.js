// API Configuration
console.log('=== API CONFIG DEBUG ===');
console.log('Environment REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
console.log('typeof process.env.REACT_APP_API_URL:', typeof process.env.REACT_APP_API_URL);
console.log('All REACT_APP_ env vars:', Object.keys(process.env).filter(key => key.startsWith('REACT_APP_')));
console.log('NODE_ENV:', process.env.NODE_ENV);

// Use environment variable or fallback to production URL
const configuredUrl = process.env.REACT_APP_API_URL || 'https://wyna.in';

// Sanitize URL: remove old IP addresses, convert http to https, remove ports
const sanitizedUrl = (configuredUrl || '')
  .replace(/^http:\/\//, 'https://') // Convert http to https
  .replace(/:[0-9]+$/, '') // Remove port numbers
  .replace(/\/$/, ''); // Remove trailing slash

const finalUrl = sanitizedUrl || 'https://wyna.in';

console.log('Configured URL:', configuredUrl);
console.log('Sanitized URL:', finalUrl);

const API_CONFIG = {
  BASE_URL: finalUrl,
  
  // Debug method to check URL construction
  debugUrlConstruction() {
    console.log('=== URL Construction Debug ===');
    console.log('BASE_URL:', this.BASE_URL);
    console.log('typeof BASE_URL:', typeof this.BASE_URL);
    console.log('ENDPOINTS.PRODUCTS:', this.ENDPOINTS.PRODUCTS);
    console.log('Full URL:', this.buildUrl(this.ENDPOINTS.PRODUCTS));
  },
  
  // API Endpoints
  ENDPOINTS: {
    // Auth
    AUTH_ADMIN_LOGIN: '/api/auth/admin/login',
    AUTH_ADMIN_REGISTER: '/api/auth/admin/register',
    AUTH_ADMIN_VERIFY: '/api/auth/admin/verify',
    
    // Products
    PRODUCTS: '/api/products',
    PRODUCTS_FEATURED: '/api/products/featured/home',
    
    // Categories
    CATEGORIES: '/api/categories',
    CATEGORIES_FEATURED: '/api/categories/featured',
    
    // Orders
    ORDERS_ADMIN_ALL: '/api/orders/admin/all',
    ORDERS_ADMIN_STATUS: (orderId) => `/api/orders/admin/${orderId}/status`,
    
    // Upload
    UPLOAD_MULTIPLE: (type) => `/api/upload/multiple/${type}`,
    
    // Images
    IMAGES_LIST: (type) => `/api/images/list/${type}`,
    IMAGES_TYPES: '/api/images/types'
  },
  
  // Helper method to build full URLs
  buildUrl(endpoint) {
    const fullUrl = `${this.BASE_URL}${endpoint}`;
    console.log('API Config - Building URL:', { 
      baseUrl: this.BASE_URL, 
      endpoint: endpoint, 
      fullUrl: fullUrl 
    });
    return fullUrl;
  }
};

export default API_CONFIG;