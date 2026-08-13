import "./GigCard.scss";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

const GigCard = ({ item }) => {
  const { userId } = item;
  const { isLoading, error, data } = useQuery({
    // Namespaced: a bare id as the key can collide with other queries.
    queryKey: ["user", userId],
    queryFn: () =>
      newRequest.get(`/users/${userId}`).then((res) => {
        return res.data;
      }),
    enabled: !!userId,
  });

  // starNumber === 0 would make the division Infinity, not NaN.
  const starNumber = item.starNumber || 0;
  const rating = starNumber > 0 ? Math.round(item.totalStars / starNumber) : 0;

  return (
    <Link to={`/gig/${item._id}`} className="link gigCardLink">
      <div className="gigCard">
        <div className="cover">
          <img src={item.cover} alt={item.title} loading="lazy" />
        </div>
        <div className="info">
          {isLoading ? (
            <div className="user placeholder" />
          ) : error ? null : (
            <div className="user">
              <img src={data?.img || "/img/noavatar.jpg"} alt="" />
              <span>{data?.username}</span>
            </div>
          )}
          {/* Title was never rendered; the raw description filled the card and
              overflowed its fixed height. Both are line-clamped now. */}
          <h3 className="title">{item.title}</h3>
          <p className="desc">{item.shortDesc || item.desc}</p>
          <div className="star">
            {starNumber > 0 ? (
              <>
                <img src="/img/star.png" alt="" />
                <span>{rating}</span>
                <small>({starNumber})</small>
              </>
            ) : (
              <small className="noRating">No reviews yet</small>
            )}
          </div>
        </div>
        <hr />
        <div className="detail">
          <img className="heart" src="/img/heart.png" alt="" />
          <div className="price">
            <span>STARTING AT</span>
            <h2>${item.price}</h2>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GigCard;
