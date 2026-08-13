import React, { useEffect, useState } from "react";
import "./Pay.scss";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import newRequest, { getErrorMessage } from "../../utils/newRequest";
import { useParams } from "react-router-dom";
import CheckoutForm from "../../components/checkoutForm/CheckoutForm";
import getCurrentUser from "../../utils/getUser";
import { EmptyState } from "../../components/state/State";

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_51PiucjB2sK1CAODN6p4gnzZ6mtDVm2ZXwp6f58mAsbWa6oeXFrWYtBaMIq1Lr3KoQBlOJKtJANijS3BePdRiKsja00BjG2dC5U"
);

const Pay = () => {
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState(null);

  const { id } = useParams();
  const currentUser = getCurrentUser();
  // Ordering is buyer-mode only. Checked before the request so reaching /pay
  // by typing the URL gives the same explanation as the gig page.
  const blockedBySellingMode = !!currentUser?.isSeller;

  useEffect(() => {
    if (blockedBySellingMode) return;
    const makeRequest = async () => {
      try {
        const res = await newRequest.post(
          `/orders/create-payment-intent/${id}`
        );
        setClientSecret(res.data.clientSecret);
      } catch (err) {
        // Surfaced instead of only landing in the console on a blank page.
        setError(getErrorMessage(err));
      }
    };
    makeRequest();
  }, [id, blockedBySellingMode]);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  if (blockedBySellingMode) {
    return (
      <div className="pay">
        <EmptyState
          icon="🔁"
          title="You're in selling mode"
          message="Switch to buying from the navbar to place an order, then open this gig again."
          actionLabel="Browse services"
          actionTo="/gigs"
        />
      </div>
    );
  }

  return (
    <div className="pay">
      {error && <div className="error">{error}</div>}
      {!error && !clientSecret && "Preparing checkout..."}
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
};

export default Pay;
