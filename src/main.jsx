import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { reportWebVitals, logPerformanceMetrics } from "./utils/performance";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Monitor Core Web Vitals
reportWebVitals((metric) => {
  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log(metric);
  }
  
  // In production, send to analytics service
  // Example: sendToAnalytics(metric);
  // Or send to Vercel Analytics, Google Analytics, etc.
});

// Log detailed performance metrics in development
if (process.env.NODE_ENV === "development") {
  logPerformanceMetrics();
}
