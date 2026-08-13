import "./Gig.scss";
import { useQuery } from "@tanstack/react-query";
import newRequest, { getErrorMessage } from "../../utils/newRequest";
import { Link, useNavigate, useParams } from "react-router-dom";
import Reviews from "../../components/reviews/Reviews";
import GigGallery from "../../components/gigGallery/GigGallery";
import ExpandableText from "../../components/expandableText/ExpandableText";
import getCurrentUser from "../../utils/getUser";
import { Loader, EmptyState } from "../../components/state/State";
import { categoryTitle } from "../../data";

function Gig() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const { isLoading, error, data } = useQuery({
    // Keyed by id, otherwise opening a second gig re-displays the first one
    // straight from the cache.
    queryKey: ["gig", id],
    queryFn: () =>
      newRequest.get(`/gigs/single/${id}`).then((res) => {
        return res.data;
      }),
  });
  const userId = data?.userId;
  const {
    isLoading: isLoadingUser,
    error: errorUser,
    data: user,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () =>
      newRequest.get(`/users/${userId}`).then((res) => {
        return res.data;
      }),
    enabled: !!userId,
  });

  // Guarded against 0 reviews: totalStars/0 is Infinity and Array(Infinity)
  // throws a RangeError.
  const starNumber = data?.starNumber || 0;
  const rating = starNumber > 0 ? Math.round(data.totalStars / starNumber) : 0;

  const handleContact = async () => {
    if (!currentUser) return navigate("/login");
    const conversationId = userId + currentUser._id;
    try {
      const res = await newRequest.get(
        `/conversations/single/${conversationId}`
      );
      navigate(`/message/${res.data.id}`);
    } catch (err) {
      if (err?.response?.status === 404) {
        // asSeller:false - contacting a gig owner always makes you the buyer,
        // even if your account is currently in selling mode.
        const res = await newRequest.post(`/conversations`, {
          to: userId,
          asSeller: false,
        });
        navigate(`/message/${res.data.id}`);
      } else {
        console.error(getErrorMessage(err));
      }
    }
  };

  const stars = (
    <div className="stars">
      {Array(rating)
        .fill(null)
        .map((_, i) => (
          <img src="/img/star.png" alt="" key={i} />
        ))}
      <span> {rating}</span>
    </div>
  );

  const isOwner = !!currentUser && currentUser._id === userId;

  return (
    <div className="gig">
      {isLoading ? (
        <Loader label="Loading this service..." />
      ) : error ? (
        <EmptyState
          variant="error"
          title="Couldn't load this service"
          message={getErrorMessage(error)}
          actionLabel="Browse services"
          actionTo="/gigs"
        />
      ) : (
        <div className="container">
          <div className="left">
            <span className="breadcrumbs">
              <Link className="link" to="/">
                fiverr
              </Link>{" "}
              &gt;{" "}
              <Link className="link" to={`/gigs?cat=${data?.cat}`}>
                {categoryTitle(data?.cat)}
              </Link>{" "}
              &gt;
            </span>
            <h1>{data?.title}</h1>

            {/* Owner-only performance panel: views were tracked server-side
                but never shown anywhere. */}
            {isOwner && (
              <div className="ownerStats">
                <div className="stat">
                  <span className="value">{data?.views || 0}</span>
                  <span className="label">Views</span>
                </div>
                <div className="stat">
                  <span className="value">{data?.sales || 0}</span>
                  <span className="label">Orders</span>
                </div>
                <div className="stat">
                  <span className="value">{starNumber}</span>
                  <span className="label">Reviews</span>
                </div>
                <div className="stat">
                  <span className="value">
                    {starNumber > 0 ? `${rating}/5` : "—"}
                  </span>
                  <span className="label">Rating</span>
                </div>
                <Link className="link manage" to="/mygigs">
                  Manage gigs
                </Link>
              </div>
            )}

            {isLoadingUser ? (
              <Loader inline label="Loading seller..." />
            ) : errorUser ? (
              "Something went wrong!"
            ) : (
              <div className="user">
                <img
                  className="pp"
                  src={user?.img || "/img/noavatar.jpg"}
                  alt=""
                />
                <span>{user?.username}</span>
                {starNumber > 0 && stars}
              </div>
            )}

            {/* Purpose-built gallery: the shared <Slide> is a full-bleed home
                page carousel and rendered an empty 100px box for gigs with no
                extra images. */}
            <GigGallery
              cover={data?.cover}
              images={data?.images}
              title={data?.title}
            />
            <h2>About This Gig</h2>
            <ExpandableText text={data?.desc} lines={8} />
            <div className="seller">
              <h2>About The Seller</h2>
              {isLoadingUser ? (
                <Loader inline label="Loading seller..." />
              ) : errorUser ? (
                "Something went wrong!"
              ) : (
                <div className="user">
                  <img src={user?.img || "/img/noavatar.jpg"} alt="" />
                  <div className="info">
                    <span>{user?.username}</span>
                    {starNumber > 0 && stars}
                    {/* Contacting yourself makes no sense. */}
                    {!isOwner && (
                      <button onClick={handleContact}>Contact Me</button>
                    )}
                  </div>
                </div>
              )}
              <div className="box">
                <div className="items">
                  <div className="item">
                    <span className="title">From</span>
                    <span className="desc">{user?.country}</span>
                  </div>
                  <div className="item">
                    <span className="title">Member since</span>
                    {/* Real value now that getUser returns createdAt. */}
                    <span className="desc">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString(
                            undefined,
                            { month: "short", year: "numeric" }
                          )
                        : "-"}
                    </span>
                  </div>
                  {/* "Avg. response time: 4 hours", "Last delivery: 1 day" and
                      "Languages: English" were hardcoded for every seller.
                      Replaced with values the API actually tracks. */}
                  <div className="item">
                    <span className="title">Delivery time</span>
                    <span className="desc">{data?.deliveryTime} days</span>
                  </div>
                  <div className="item">
                    <span className="title">Orders completed</span>
                    <span className="desc">{data?.sales || 0}</span>
                  </div>
                  <div className="item">
                    <span className="title">Rating</span>
                    <span className="desc">
                      {starNumber > 0
                        ? `${rating} / 5 (${starNumber} ${
                            starNumber === 1 ? "review" : "reviews"
                          })`
                        : "Not rated yet"}
                    </span>
                  </div>
                </div>
                <hr />
                <p>{user?.desc}</p>
              </div>
            </div>
            <Reviews gigId={id} sellerId={userId} />
          </div>
          <div className="right">
            <div className="price">
              <h3>{data?.shortTitle}</h3>
              <h2>$ {data?.price}</h2>
            </div>
            <p>{data?.shortDesc}</p>
            <div className="details">
              <div className="item">
                <img src="/img/clock.png" alt="" />
                {/* The schema field is deliveryTime - deliveryDate never existed. */}
                <span>{data?.deliveryTime} Days Delivery</span>
              </div>
              <div className="item">
                <img src="/img/recycle.png" alt="" />
                <span>{data?.revisionNumber} Revisions</span>
              </div>
            </div>
            <div className="features">
              {data?.features?.map((feature) => (
                <div className="item" key={feature}>
                  <img src="/img/greencheck.png" alt="" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            {/* Ordering is a buyer-mode action; the API rejects it in selling
                mode, so say why instead of letting the click fail. */}
            {isOwner ? (
              <Link className="link" to="/mygigs">
                <button>Manage this gig</button>
              </Link>
            ) : !currentUser ? (
              <Link className="link" to="/login">
                <button>Sign in to order</button>
              </Link>
            ) : currentUser.isSeller ? (
              <div className="modeGate">
                <button disabled>Continue</button>
                <span>
                  You're in selling mode. Switch to buying from the navbar to
                  place an order.
                </span>
              </div>
            ) : (
              <Link className="link" to={`/pay/${id}`}>
                <button>Continue</button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Gig;
