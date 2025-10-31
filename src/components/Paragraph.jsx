import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../styles/Paragraph.css";


const Paragraph = ({ value }) => {
  const element = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const chars = element.current.querySelectorAll(".character span");

      gsap.fromTo(
        chars,
        { opacity: 0.2 },
        {
          opacity: 1,
          ease: "power2.out",
          stagger: {
            each: 0.02, // adjust for reveal speed
            from: "start",
          },
          scrollTrigger: {
            trigger: element.current,
            start: "top 85%",
            end: "bottom 60%",
            scrub: true, // keeps smooth connection with scroll
          },
        }
      );
    }, element);

    return () => ctx.revert();
  }, []);

  const words = value.split(" ");

  return (
    <section style={{ minHeight: "200vh" }}>
      <p className="paragraph" ref={element}>
        {words.map((word, i) => (
          <Word key={i} word={word} />
        ))}
      </p>
    </section>
  );
};

export default Paragraph;

const Word = ({ word }) => {
  const characters = word.split("");
  return (
    <span className="word">
      {characters.map((character, i) => (
        <Character key={i} character={character} />
      ))}
      &nbsp;
    </span>
  );
};

const Character = ({ character }) => {
  return (
    <span className="character">
      <span>{character}</span>
    </span>
  );
};
