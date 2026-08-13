import { Link } from "react-router-dom";
import "./CatCard.scss";

function CatCard({
  img,
  title,
  desc,
  cat,
}: {
  img: string;
  title: string;
  desc: string;
  cat: string;
}) {
  // The API filters on `cat`, not `category`, and every card used to link to
  // the same hardcoded "design" value.
  return (
    <Link className="link" to={`/gigs?cat=${cat}`}>
      <div className="catCard">
        <img src={img} alt={title} loading="lazy" />
        <span className="desc">{desc}</span>
        <span className="title">{title}</span>
      </div>
    </Link>
  );
}
export default CatCard;
