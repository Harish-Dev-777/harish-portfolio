import React from "react";
import Hero from "./Hero";
import Paragraph from "../components/Paragraph";
import CurvedLoop from "../components/CurvedLoop";
import "../styles/Home.css";
import ServiceFlowingMenu from "../components/ServiceFlowingMenu";
import Contact from "./Contact";

const Home = () => {
  const supportingText = `From small stores to startups - I help bring your business ideas to life with pixel-perfect design, smooth user experience, and performance-driven development.`;

  const rotatingText = `Websites ✦ Web Apps ✦ E-Commerce ✦ Portfolios ✦ 3d-Modal Websites ✦`;

  return (
    <div>
      <Hero />

      {/* Supporting Section */}
      <div className="supportingTextContainer">
        <div>
          <img src="/images/site_support.jpg" alt="site-support-image" />
        </div>
        <div>
          <Paragraph value={supportingText} />
        </div>
      </div>

      {/* Curved Loop Section */}
      <div className="curvedLoop">
        <CurvedLoop
          marqueeText={rotatingText}
          speed={3}
          curveAmount={500}
          direction="right"
          interactive={true}
          className="custom-text-style"
        />
      </div>

      {/* Services Section */}
      <div className="servicesLoopContainer">
        <h1>Services</h1>
        <ServiceFlowingMenu />
      </div>
      <Contact />
    </div>
  );
};

export default Home;
