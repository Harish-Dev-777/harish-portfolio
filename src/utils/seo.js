/**
 * SEO Utilities - Centralized SEO management
 * Provides structured data and meta tag helpers
 */

export const siteMetadata = {
  title: "Harish - Freelance Web Developer & Designer",
  description: "Award-winning freelance web developer specializing in modern, high-performance websites, web apps, e-commerce, and 3D experiences. Creating digital solutions that perform and inspire.",
  author: "Harish",
  siteUrl: "https://harish-portfolio.vercel.app", // Update with your actual domain
  image: "/images/og-image.jpg", // We'll create this
  twitterHandle: "@harish_dev", // Update with your handle
  keywords: "web developer, freelance developer, react developer, web design, portfolio, UI/UX, 3D websites, e-commerce development",
};

/**
 * Generate structured data for SEO (JSON-LD)
 */
export const generateStructuredData = (pageType = "website", customData = {}) => {
  const baseData = {
    "@context": "https://schema.org",
    "@type": pageType === "person" ? "Person" : "WebSite",
    name: siteMetadata.author,
    url: siteMetadata.siteUrl,
    description: siteMetadata.description,
  };

  if (pageType === "person") {
    return {
      ...baseData,
      "@type": "Person",
      jobTitle: "Freelance Web Developer",
      knowsAbout: ["Web Development", "React", "JavaScript", "UI/UX Design", "3D Web Experiences"],
      sameAs: [
        // Add your social profiles
        "https://github.com/yourusername",
        "https://linkedin.com/in/yourusername",
        "https://twitter.com/yourusername",
      ],
      ...customData,
    };
  }

  return { ...baseData, ...customData };
};

/**
 * Page-specific meta configurations
 */
export const pageMetadata = {
  home: {
    title: "Harish - Freelance Web Developer | Modern Digital Experiences",
    description: "Award-winning freelance web developer creating modern, high-performance websites and web applications. Specializing in React, 3D experiences, and pixel-perfect design.",
    keywords: "freelance web developer, react developer, modern websites, 3D web experiences, portfolio",
  },
  about: {
    title: "About Harish - Web Developer & Designer",
    description: "Learn about Harish, a passionate freelance web developer with expertise in creating stunning, performance-driven digital experiences.",
    keywords: "about, web developer, designer, freelance, expertise",
  },
  projects: {
    title: "Projects - Portfolio by Harish",
    description: "Explore my portfolio of award-winning web projects, from e-commerce platforms to interactive 3D experiences.",
    keywords: "portfolio, web projects, case studies, web development work",
  },
  services: {
    title: "Services - Web Development & Design",
    description: "Professional web development services including custom websites, web apps, e-commerce solutions, and 3D interactive experiences.",
    keywords: "web development services, web design, e-commerce, web apps, 3D websites",
  },
  contact: {
    title: "Contact Harish - Let's Work Together",
    description: "Get in touch to discuss your next web project. Available for freelance work and collaborations.",
    keywords: "contact, hire web developer, freelance, collaboration",
  },
};
