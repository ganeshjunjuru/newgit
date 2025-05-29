// src/index.tsx (or src/main.tsx depending on your project setup)

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Your global CSS file
import AppWrapper from './App'; // Import the AppWrapper from App.tsx

// Get the root HTML element where your React app will be mounted
const rootElement = document.getElementById('root');

// Ensure the root element exists before attempting to render
if (rootElement) {
  // Create a React root and render the AppWrapper component into it
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <AppWrapper /> {/* This will render your App component with BrowserRouter */}
    </React.StrictMode>
  );
} else {
  // Log an error if the root element is not found, helpful for debugging
  console.error("Root element with ID 'root' not found in the DOM.");
}