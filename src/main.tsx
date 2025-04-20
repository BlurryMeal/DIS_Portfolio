
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

  
  // Ensure viewport is properly set for mobile
  const setViewportForMobile = () => {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      document.head.appendChild(meta);
    }
  };
  
  // Initialize mobile optimizations
  setViewportForMobile();
  
  // Initialize app with error boundary
  const reportError = (error: any) => {
    console.error("Application error:", error); 
    // Show fallback UI if render fails
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 20px; text-align: center; color: white;">
          <h2>Something went wrong</h2>
          <p>Please try refreshing the page</p>
          <small style="color: #888; margin-top: 10px; display: block;">Error: ${error.message || 'Unknown error'}</small>
        </div>
      `;
    }

};

// Global error handler to prevent app crashes
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  event.preventDefault(); // Prevent the error from crashing the app
});

// Additional unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  event.preventDefault();
});

// Initialize app with improved error boundary
try {
  const root = document.getElementById("root");
  
  if (!root) {
    throw new Error("Root element not found");
  }
  
  createRoot(root).render(<App />);
} catch (error) {
  reportError(error);
  }
