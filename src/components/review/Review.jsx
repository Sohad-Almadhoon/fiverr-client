import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import newRequest from "../../utils/newRequest";
import { Loader } from "../state/State";
import "./Review.scss";

const Review = ({ review }) => {
  const { isLoading, error, data } = useQuery({
    // Namespaced: a bare id as the key can collide with other queries.
    queryKey: ["user", review.userId],
    queryFn: () =>
      newRequest.get(`/users/${review.userId}`).then((res) => {
        return res.data;
      }),
  });

  return (
    <div className="review">
      {isLoading ? (
        <Loader inline label="" />
      ) : error ? (
        <div className="user">
          <img className="pp" src="/img/noavatar.jpg" alt="" />
          <div className="info">
            <span>Unknown user</span>
          </div>
        </div>
      ) : (
        <div className="user">
          <img className="pp" src={data?.img || "/img/noavatar.jpg"} alt="" />
          <div className="info">
            <span>{data?.username}</span>
            {data?.country && (
              <div className="country">
                <span>{data.country}</span>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="stars">
        {Array(review.star || 0)
          .fill(null)
          .map((item, i) => (
            <img src="/img/star.png" alt="" key={i} />
          ))}
        <span>{review.star}</span>
        {/* Real timestamp, replacing the fake "Helpful? Yes / No" widget that
            sat here doing nothing. */}
        {review.createdAt && (
          <small className="date">{moment(review.createdAt).fromNow()}</small>
        )}
      </div>
      <p>{review.desc}</p>
    </div>
  );
};

export default Review;
