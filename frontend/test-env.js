// Test script to check environment variables
console.log('=== ENVIRONMENT VARIABLE TEST ===');
console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('All env vars starting with REACT_APP_:');
Object.keys(process.env).forEach(key => {
  if (key.startsWith('REACT_APP_')) {
    console.log(`  ${key}: ${process.env[key]}`);
  }
});

// Test API_CONFIG
const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'https://wyna.in'
};

console.log('API_CONFIG.BASE_URL:', API_CONFIG.BASE_URL);
console.log('Expected: https://wyna.in');
console.log('Match?', API_CONFIG.BASE_URL === 'https://wyna.in');
