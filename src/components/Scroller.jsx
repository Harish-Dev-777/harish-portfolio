import ScrollVelocity from "./ScrollVelocity";
import "../styles/ScrollVelocity.css";

const Scroller = () => {
  const velocity = 100;

  return (
    <section style={{ width: "100%", overflow: "hidden" }}>
      <ScrollVelocity
        texts={["Freelancer", "Full Stack Developer"]}
        velocity={velocity}
        className="custom-scroll-text"
        parallaxClassName="parallax"
        scrollerClassName="scroller"
      />
    </section>
  );
};

export default Scroller;
