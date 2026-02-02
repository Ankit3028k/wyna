// Helper function to convert image URLs to full URLs in production
const convertImageUrls = (product) => {
  if (process.env.NODE_ENV === 'production') {
    const baseUrl = process.env.CLIENT_URL || 'https://www.wyna.in';
    
    // Convert images array
    if (product.images && Array.isArray(product.images)) {
      product.images = product.images.map(img => ({
        ...img,
        url: img.url && img.url.startsWith('/') ? `${baseUrl}${img.url}` : img.url
      }));
    }
    
    // Convert single image field
    if (product.image && product.image.startsWith('/')) {
      product.image = `${baseUrl}${product.image}`;
    }
  }
  return product;
};

module.exports = { convertImageUrls };
