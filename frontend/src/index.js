import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
// import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
  
      <App />
      <Toaster position="top-right" />
   
  </React.StrictMode>
);
