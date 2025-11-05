import React from "react";
import FlowingMenu from "./FlowingMenu";

const demoItems = [
  { link: "#", text: "Web Development", image: "/images/WebDevelopment.png" },
  {
    link: "#",
    text: "Maintenance & Support Services",
    image: "/images/Maintenance.png",
  },
  {
    link: "#",
    text: "Full-Stack Web Applications",
    image: "/images/FullStackApp.png",
  },
  { link: "#", text: "Website Optimization & SEO", image: "/images/SEO.png" },
  {
    link: "#",
    text: "UI/UX Design to Code Conversion",
    image: "/images/DesignToCode.png",
  },
];

const ServiceFlowingMenu = () => (
  <div style={{ height: "600px", position: "relative" }}>
    <FlowingMenu items={demoItems} />
  </div>
);

export default ServiceFlowingMenu;
