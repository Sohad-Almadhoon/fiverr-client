import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import "./Slide.scss";

// Was a plain <button>Previous</button> / <button>Next</button> sitting on top
// of the slides.
const Chevron = ({ dir }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points={dir === "left" ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
  </svg>
);

const PreviousArrow = ({ onClick }) => (
  <button
    type="button"
    className="slideArrow prev"
    aria-label="Previous"
    onClick={onClick}>
    <Chevron dir="left" />
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    type="button"
    className="slideArrow next"
    aria-label="Next"
    onClick={onClick}>
    <Chevron dir="right" />
  </button>
);

const Slide = ({ children, slidesToShow, arrowsScroll }) => {
  const count = Array.isArray(children) ? children.length : children ? 1 : 0;

  // slidesToShow was fixed, so the home page tried to fit 5 cards across a
  // 375px phone. Step it down with the viewport, never below 1.
  const step = (breakpoint, shown) => ({
    breakpoint,
    settings: {
      slidesToShow: Math.min(slidesToShow, shown),
      slidesToScroll: Math.min(arrowsScroll, shown),
    },
  });

  const settings = {
    slidesToShow: Math.min(slidesToShow, Math.max(count, 1)),
    // Arrows and looping are pointless when everything already fits on screen.
    arrows: count > slidesToShow,
    infinite: count > slidesToShow,
    speed: 500,
    slidesToScroll: arrowsScroll,
    prevArrow: <PreviousArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      step(1400, 4),
      step(1200, 3),
      step(1024, 3),
      step(768, 2),
      step(560, 1),
    ],
  };

  if (!count) return null;

  return (
    <div className="slide">
      <div className="container">
        <Slider {...settings}>{children}</Slider>
      </div>
    </div>
  );
};

export default Slide;
