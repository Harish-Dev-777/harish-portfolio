import { useRef, useEffect, memo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../styles/Paragraph.css";

gsap.registerPlugin(ScrollTrigger);

const Paragraph = ({ value }) => {
  const element = useRef(null);

  useEffect(() => {
    const el = element.current;
    if (!el) return;

    const chars = el.querySelectorAll(".char");

    // Use one GSAP timeline instead of per-character triggers (huge performance boost)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        end: "bottom 60%",
        scrub: 1.5,
      },
    });

    tl.fromTo(
      chars,
      { opacity: 0.15 },
      {
        opacity: 1,
        stagger: 0.015,
        ease: "power2.out",
        duration: 0.6,
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      tl.kill();
    };
  }, []);

  return (
    <p className="paragraph" ref={element}>
      {value.split(" ").map((word, i) => (
        <span className="word" key={i}>
          {word.split("").map((ch, j) => (
            <span className="char" key={j}>
              {ch}
            </span>
          ))}
          &nbsp;
        </span>
      ))}
    </p>
  );
};

// ✅ memo() prevents unnecessary re-renders
export default memo(Paragraph);
