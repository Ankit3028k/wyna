import React, { useEffect } from 'react';
import API_CONFIG from '../../config/api';

const ApiTest = () => {
  useEffect(() => {
    console.log('=== API TEST COMPONENT ===');
    console.log('BASE_URL:', API_CONFIG.BASE_URL);
    console.log('ACTUAL_BASE_URL:', API_CONFIG.ACTUAL_BASE_URL);
    
    // Test URL construction
    const testUrl = API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.PRODUCTS);
    console.log('Test URL:', testUrl);
    
    // Try a simple fetch to see where it actually goes
    fetch(testUrl)
      .then(response => {
        console.log('Fetch response URL:', response.url);
        console.log('Fetch response status:', response.status);
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
  }, []);

  const expectedUrl = 'http://72.61.238.132:5000';
  const isCorrect = API_CONFIG.BASE_URL === expectedUrl;

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: isCorrect ? '#d4edda' : '#f8d7da', 
      margin: '20px',
      border: `2px solid ${isCorrect ? '#28a745' : '#dc3545'}`,
      borderRadius: '5px'
    }}>
      <h3>🔍 API Configuration Debug</h3>
      <p><strong>Expected URL:</strong> {expectedUrl}</p>
      <p><strong>Actual BASE_URL:</strong> {API_CONFIG.BASE_URL}</p>
      <p><strong>ACTUAL_BASE_URL:</strong> {API_CONFIG.ACTUAL_BASE_URL || 'undefined'}</p>
      <p><strong>Status:</strong> {isCorrect ? '✅ CORRECT' : '❌ INCORRECT'}</p>
      <p><strong>Test URL:</strong> {API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.PRODUCTS)}</p>
      <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
        Check browser console for detailed debugging information.
      </div>
    </div>
  );
};

export default ApiTest;
