import { memo, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger, SplitText } from "gsap/all";

import Navbar from "./components/Navbar";
import Hero from "./pages/Hero";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";

// ✅ Register GSAP plugins once (prevents multiple registrations)
gsap.registerPlugin(ScrollTrigger, SplitText);

const App = () => {
  // ✅ Prevent ScrollTrigger + GSAP timeline reinitialization
  useEffect(() => {
    // Force GSAP to refresh only once after first render
    ScrollTrigger.refresh();
  }, []);

  return (
    <main className="w-full overflow-x-hidden">
      {/* ✅ Navbar is static across pages — keep it outside heavy scroll sections */}
      <Navbar />

      {/* ✅ Each section is isolated – improves GSAP performance */}
      <Hero />
      <About />
      <Projects />
      <Services />
      <Contact />

      <Footer />
    </main>
  );
};

// ✅ memo prevents App from re-rendering unnecessarily
export default memo(App);
