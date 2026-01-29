# Environment Configuration

This project uses environment variables to configure the API base URL for different environments.

## Environment Files

- `.env` - Default environment variables (used in production)
- `.env.development` - Development environment variables
- `.env.production` - Production environment variables

## Configuration

The API base URL is configured using the `REACT_APP_API_URL` environment variable:

```
REACT_APP_API_URL=http://72.61.238.132:5000
```

## Usage

All API calls in the frontend now use the centralized API configuration:

```javascript
import API_CONFIG from '../config/api';

// Example usage
const response = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.PRODUCTS));
```

## Benefits

1. **Environment Flexibility**: Easy to switch between development and production APIs
2. **Centralized Configuration**: All API endpoints are managed in one place
3. **No Hardcoded URLs**: Eliminates hardcoded IP addresses throughout the codebase
4. **Easy Deployment**: Simple to change API URLs for different deployment targets

## Available Endpoints

The `API_CONFIG.ENDPOINTS` object contains all available API endpoints:
- AUTH_ADMIN_LOGIN
- AUTH_ADMIN_REGISTER
- AUTH_ADMIN_VERIFY
- PRODUCTS
- PRODUCTS_FEATURED
- CATEGORIES
- CATEGORIES_FEATURED
- ORDERS_ADMIN_ALL
- ORDERS_ADMIN_STATUS
- UPLOAD_MULTIPLE
- IMAGES_LIST
- IMAGES_TYPES

## Development vs Production

During development, the app will use `http://http://72.61.238.132:5000` by default.
In production, it will use `http://72.61.238.132:5000`.

You can override these by setting the `REACT_APP_API_URL` environment variable.