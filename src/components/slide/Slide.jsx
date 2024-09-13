import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import "./Slide.scss";

const PreviousArrow = ({ onClick }) => (
  <button className="prev-arrow" onClick={onClick}>
    Previous
  </button>
);

const NextArrow = ({ onClick }) => (
  <button className="next-arrow" onClick={onClick}>
    Next
  </button>
);

const Slide = ({ children, slidesToShow, arrowsScroll }) => {
  const settings = {
    slidesToShow: slidesToShow,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToScroll: arrowsScroll,
    prevArrow: <PreviousArrow />,
    nextArrow: <NextArrow />,
  };

  return (
    <div className="slide">
      <div className="container">
        <Slider {...settings}>{children}</Slider>
      </div>
    </div>
  );
};

export default Slide;
