
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

window.addEventListener('error', (event) => {
    console.error('Global error caught:', event.error);
    // Prevent the error from crashing the app on mobile
    event.preventDefault();
  });
  
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
  try {
    createRoot(document.getElementById("root")!).render(<App />);
  } catch (error) {
    console.error("Failed to render application:", error);
    // Show fallback UI if render fails
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 20px; text-align: center; color: white;">
          <h2>Something went wrong</h2>
          <p>Please try refreshing the page</p>
        </div>
      `;
    }
  }
