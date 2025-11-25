import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { siteMetadata, generateStructuredData } from "../utils/seo";

/**
 * SEO Component - Manages meta tags and structured data
 * @param {Object} props - SEO configuration
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description
 * @param {string} props.keywords - Page keywords
 * @param {string} props.image - OG image URL
 * @param {string} props.type - Page type (website, article, etc.)
 * @param {Object} props.structuredData - Custom structured data
 */
const SEO = ({
  title,
  description = siteMetadata.description,
  keywords = siteMetadata.keywords,
  image = siteMetadata.image,
  type = "website",
  structuredData = null,
}) => {
  const location = useLocation();
  const pageUrl = `${siteMetadata.siteUrl}${location.pathname}`;
  const fullTitle = title ? `${title} | ${siteMetadata.author}` : siteMetadata.title;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Update or create meta tags
    const updateMetaTag = (name, content, isProperty = false) => {
      const attribute = isProperty ? "property" : "name";
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute("content", content);
    };

    // Standard meta tags
    updateMetaTag("description", description);
    updateMetaTag("keywords", keywords);
    updateMetaTag("author", siteMetadata.author);

    // Open Graph tags
    updateMetaTag("og:title", fullTitle, true);
    updateMetaTag("og:description", description, true);
    updateMetaTag("og:type", type, true);
    updateMetaTag("og:url", pageUrl, true);
    updateMetaTag("og:image", `${siteMetadata.siteUrl}${image}`, true);
    updateMetaTag("og:site_name", siteMetadata.title, true);

    // Twitter Card tags
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:creator", siteMetadata.twitterHandle);
    updateMetaTag("twitter:title", fullTitle);
    updateMetaTag("twitter:description", description);
    updateMetaTag("twitter:image", `${siteMetadata.siteUrl}${image}`);

    // Additional SEO tags
    updateMetaTag("robots", "index, follow");
    updateMetaTag("googlebot", "index, follow");
    
    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", pageUrl);

    // Structured Data (JSON-LD)
    let scriptTag = document.querySelector('script[type="application/ld+json"]');
    if (!scriptTag) {
      scriptTag = document.createElement("script");
      scriptTag.setAttribute("type", "application/ld+json");
      document.head.appendChild(scriptTag);
    }
    
    const schema = structuredData || generateStructuredData(type);
    scriptTag.textContent = JSON.stringify(schema);

  }, [fullTitle, description, keywords, image, type, pageUrl, structuredData]);

  return null; // This component doesn't render anything
};

export default SEO;
