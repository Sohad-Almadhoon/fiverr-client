import { Link } from "react-router-dom";
import "./CatCard.scss";

function CatCard({
  img,
  title,
  desc,
}: {
  img: string;
  title: string;
  desc: string;
  }) {
  return (
    <Link to="/gigs?cat=design">
      <div className="catCard">
        <img src={img} alt="" />
        <span className="desc">{desc}</span>
        <span className="title">{title}</span>
      </div>
    </Link>
  );
}
export default CatCard;
