import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest, { getErrorMessage } from "../../utils/newRequest";
import Review from "../review/Review";
import { Loader, EmptyState } from "../state/State";
import getCurrentUser from "../../utils/getUser";
import "./Reviews.scss";

const Reviews = ({ gigId, sellerId }) => {
  const queryClient = useQueryClient();
  const currentUser = getCurrentUser();
  const [error, setError] = useState(null);

  const {
    isLoading,
    error: queryError,
    data,
  } = useQuery({
    queryKey: ["reviews", gigId],
    queryFn: () =>
      newRequest.get(`/reviews/${gigId}`).then((res) => {
        return res.data;
      }),
    enabled: !!gigId,
  });

  // The API only accepts a review from someone who completed an order for this
  // gig. Check the same condition here so the form isn't offered to people
  // whose submission would just bounce with a 403.
  const { data: orders } = useQuery({
    queryKey: ["orders"],
    queryFn: () => newRequest.get("/orders").then((res) => res.data),
    enabled: !!currentUser,
  });

  const mutation = useMutation({
    mutationFn: (review) => {
      return newRequest.post("/reviews", review);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", gigId] });
      // The gig's star totals changed too, so refresh it.
      queryClient.invalidateQueries({ queryKey: ["gig", gigId] });
    },
    // Errors like "you already reviewed this gig" were invisible before.
    onError: (err) => setError(getErrorMessage(err)),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    const form = e.target;
    const desc = form[0].value.trim();
    const star = Number(form[1].value);
    if (!desc) return;
    mutation.mutate({ desc, star, gigId });
    form.reset();
  };

  const isOwner = !!currentUser && currentUser._id === sellerId;
  const hasPurchased = (orders || []).some(
    (o) => o.gigId === gigId && o.buyerId === currentUser?._id
  );
  const alreadyReviewed = (data || []).some(
    (r) => r.userId === currentUser?._id
  );

  const notice = !currentUser
    ? { text: "Sign in to leave a review.", to: "/login", cta: "Sign in" }
    : isOwner
    ? { text: "You can't review your own gig." }
    : alreadyReviewed
    ? { text: "You've already reviewed this gig." }
    : !hasPurchased
    ? { text: "Only buyers who completed an order can review this gig." }
    : null;

  return (
    <div className="reviews">
      <h2>Reviews</h2>
      {isLoading ? (
        <Loader label="Loading reviews..." />
      ) : queryError ? (
        <EmptyState
          variant="error"
          title="Couldn't load reviews"
          message={getErrorMessage(queryError)}
        />
      ) : data?.length ? (
        data.map((review) => <Review key={review._id} review={review} />)
      ) : (
        <EmptyState
          icon="⭐"
          title="No reviews yet"
          message={
            isOwner
              ? "Buyers can leave a review once they complete an order."
              : "Be the first to share your experience with this service."
          }
        />
      )}

      <div className="add">
        {notice ? (
          <div className="reviewNotice">
            <span>{notice.text}</span>
            {notice.to && (
              <Link className="link" to={notice.to}>
                {notice.cta}
              </Link>
            )}
          </div>
        ) : (
          <>
            <h3>Add a review</h3>
            <form action="" className="addForm" onSubmit={handleSubmit}>
              <input type="text" placeholder="write your opinion" />
              <select name="star" id="star" defaultValue={5}>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
              <button disabled={mutation.isPending}>
                {mutation.isPending ? "Sending..." : "Send"}
              </button>
            </form>
            {error && <span className="error">{error}</span>}
          </>
        )}
      </div>
    </div>
  );
};

export default Reviews;
