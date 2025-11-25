/**
 * Accessibility Utilities
 * Improves keyboard navigation, screen reader support, and ARIA attributes
 */

/**
 * Skip to main content link (for keyboard users)
 */
export const SkipToContent = () => {
  return (
    <a
      href="#main-content"
      className="skip-to-content"
      style={{
        position: "absolute",
        left: "-9999px",
        zIndex: 999,
        padding: "1rem 1.5rem",
        background: "var(--color-primary-bg)",
        color: "var(--text-primary)",
        textDecoration: "none",
        borderRadius: "4px",
        border: "2px solid var(--text-primary)",
      }}
      onFocus={(e) => {
        e.target.style.left = "1rem";
        e.target.style.top = "1rem";
      }}
      onBlur={(e) => {
        e.target.style.left = "-9999px";
      }}
    >
      Skip to main content
    </a>
  );
};

/**
 * Focus trap for modals and dialogs
 */
export const useFocusTrap = (ref) => {
  const handleKeyDown = (e) => {
    if (e.key !== "Tab") return;

    const focusableElements = ref.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (!focusableElements || focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  };

  return handleKeyDown;
};

/**
 * Announce to screen readers
 */
export const announceToScreenReader = (message, priority = "polite") => {
  const announcement = document.createElement("div");
  announcement.setAttribute("role", "status");
  announcement.setAttribute("aria-live", priority);
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

/**
 * Screen reader only text utility
 */
export const ScreenReaderOnly = ({ children }) => {
  return (
    <span
      style={{
        position: "absolute",
        width: "1px",
        height: "1px",
        padding: 0,
        margin: "-1px",
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        border: 0,
      }}
    >
      {children}
    </span>
  );
};

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = () => {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

/**
 * Get accessible color contrast ratio
 */
export const getContrastRatio = (color1, color2) => {
  // Simplified contrast ratio calculation
  // For production, use a library like 'color-contrast-checker'
  const getLuminance = (color) => {
    // This is a placeholder - implement proper luminance calculation
    return 0.5;
  };

  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
};

export default {
  SkipToContent,
  useFocusTrap,
  announceToScreenReader,
  ScreenReaderOnly,
  prefersReducedMotion,
  getContrastRatio,
};
