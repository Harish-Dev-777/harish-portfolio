import { useState, useEffect, useRef, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMapPin,
  FiNavigation,
  FiMaximize2,
  FiMinimize2,
  FiZoomIn,
  FiZoomOut,
  FiMap,
  FiLayers,
} from "react-icons/fi";
import "../styles/Contact.css";

const EnhancedMap = memo(({ location }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapType, setMapType] = useState("roadmap"); // roadmap, satellite, hybrid, terrain
  const [zoom, setZoom] = useState(15);
  const [showControls, setShowControls] = useState(true);
  const mapContainerRef = useRef(null);
  const iframeRef = useRef(null);

  // Generate map URL with all parameters
  const getMapUrl = () => {
    // Use the standard Google Maps embed with layer parameter for map types
    const baseUrl = "https://maps.google.com/maps";
    const encodedLocation = encodeURIComponent(location);

    // Map type parameter mapping
    const layerMap = {
      roadmap: "m", // Standard roadmap
      satellite: "k", // Satellite imagery
      hybrid: "h", // Hybrid (satellite + labels)
      terrain: "p", // Terrain
    };

    const layer = layerMap[mapType] || "m";

    // Build URL with proper parameters
    return `${baseUrl}?q=${encodedLocation}&t=${layer}&z=${zoom}&output=embed&iwloc=near`;
  };

  // Get directions to location
  const getDirections = () => {
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location)}`;
    window.open(directionsUrl, "_blank", "noopener,noreferrer");
  };

  // Open in Google Maps app/website
  const openInGoogleMaps = () => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
    window.open(mapsUrl, "_blank", "noopener,noreferrer");
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mapContainerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Zoom controls
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 1, 21));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 1, 1));

  // Map type options
  const mapTypes = [
    { value: "roadmap", label: "Road", icon: FiMap },
    { value: "satellite", label: "Satellite", icon: FiLayers },
    { value: "hybrid", label: "Hybrid", icon: FiLayers },
    { value: "terrain", label: "Terrain", icon: FiMap },
  ];

  return (
    <div
      ref={mapContainerRef}
      className={`enhanced-map-container ${isFullscreen ? "fullscreen" : ""}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Map iframe */}
      <iframe
        ref={iframeRef}
        title="Enhanced Location Map"
        src={getMapUrl()}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        className="map-iframe"
      />

      {/* Map Controls Overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            className="map-controls"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Top Controls */}
            <div className="map-controls-top">
              {/* Map Type Selector */}
              <div className="map-type-selector">
                {mapTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      onClick={() => setMapType(type.value)}
                      className={`map-type-btn ${mapType === type.value ? "active" : ""}`}
                      title={type.label}
                      aria-label={`Switch to ${type.label} view`}
                    >
                      <Icon size={16} />
                      <span>{type.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Fullscreen Toggle */}
              <button
                onClick={toggleFullscreen}
                className="map-control-btn"
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                aria-label={
                  isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"
                }
              >
                {isFullscreen ? (
                  <FiMinimize2 size={20} />
                ) : (
                  <FiMaximize2 size={20} />
                )}
              </button>
            </div>

            {/* Side Controls */}
            <div className="map-controls-side">
              {/* Zoom Controls */}
              <div className="zoom-controls">
                <button
                  onClick={handleZoomIn}
                  className="zoom-btn"
                  title="Zoom In"
                  aria-label="Zoom In"
                  disabled={zoom >= 21}
                >
                  <FiZoomIn size={18} />
                </button>
                <div className="zoom-level">{zoom}</div>
                <button
                  onClick={handleZoomOut}
                  className="zoom-btn"
                  title="Zoom Out"
                  aria-label="Zoom Out"
                  disabled={zoom <= 1}
                >
                  <FiZoomOut size={18} />
                </button>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="map-controls-bottom">
              {/* Get Directions */}
              <button
                onClick={getDirections}
                className="map-action-btn directions-btn"
                title="Get Directions"
              >
                <FiNavigation size={18} />
                <span>Get Directions</span>
              </button>

              {/* Open in Google Maps */}
              <button
                onClick={openInGoogleMaps}
                className="map-action-btn open-maps-btn"
                title="Open in Google Maps"
              >
                <FiMapPin size={18} />
                <span>Open in Maps</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Fallback */}
      <div className="map-fallback">
        <div className="map-loader">
          <FiMapPin size={32} />
          <p>Loading map...</p>
        </div>
      </div>
    </div>
  );
});

EnhancedMap.displayName = "EnhancedMap";

export default EnhancedMap;
