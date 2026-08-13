import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import newRequest, { getErrorMessage } from "../../utils/newRequest";
import "./success.scss"; // Import the CSS file

const Success = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const payment_intent = new URLSearchParams(search).get("payment_intent");

  useEffect(() => {
    let timer;
    const makeRequest = async () => {
      try {
        await newRequest.put("/orders", { payment_intent });
        // The copy below promises the orders page, so go there.
        timer = setTimeout(() => {
          navigate("/orders");
        }, 5000);
      } catch (err) {
        setError(getErrorMessage(err));
      }
    };

    makeRequest();
    return () => clearTimeout(timer);
  }, [navigate, payment_intent]);

  return (
    <div className="success-container">
      <div className="success-message">
        {error ? "We couldn't confirm your order" : "Payment Successful!"}
      </div>
      <div className="redirect-info">
        {error ||
          "You are being redirected to the orders page. Please do not close the page."}
      </div>
      {!error && <div className="spinner"></div>}
    </div>
  );
};

export default Success;
