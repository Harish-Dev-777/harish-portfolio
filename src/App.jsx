import { useEffect, memo, lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger, SplitText } from "gsap/all";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { SkipToContent } from "./utils/accessibility";

// Lazy load page components for better performance
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Projects = lazy(() => import("./pages/Projects"));
const Services = lazy(() => import("./pages/Services"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

gsap.registerPlugin(ScrollTrigger, SplitText);

// Loading fallback component
const PageLoader = () => (
  <div 
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      background: "var(--color-primary-bg)",
      color: "var(--text-primary)",
    }}
    aria-live="polite"
    aria-busy="true"
  >
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          width: "48px",
          height: "48px",
          border: "3px solid rgba(255, 255, 255, 0.1)",
          borderTopColor: "rgba(255, 255, 255, 0.8)",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          margin: "0 auto 1rem",
        }}
      />
      <p style={{ fontSize: "0.875rem", opacity: 0.7 }}>Loading...</p>
    </div>
    <style>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

const App = () => {
  const location = useLocation();

  useEffect(() => {
    ScrollTrigger.refresh();
  }, [location.pathname]);

  return (
    <>
      <SkipToContent />
      <div className="w-full overflow-x-hidden">
        <ScrollToTop />
        <Navbar />
        <main id="main-content">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default memo(App);
