import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./success.scss"; // Import the CSS file

const Success = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);
  const payment_intent = params.get("payment_intent");

  useEffect(() => {
    const makeRequest = async () => {
      try {
        await newRequest.put("/orders", { payment_intent });
        setTimeout(() => {
          navigate("/");
        }, 5000);
      } catch (err) {
        console.log(err);
      }
    };

    makeRequest();
  }, []);

  return (
    <div className="success-container">
      <div className="success-message">Payment Successful!</div>
      <div className="redirect-info">
        You are being redirected to the orders page. Please do not close the
        page.
      </div>
      <div className="spinner"></div>{" "}
      {/* Optional spinner for visual feedback */}
    </div>
  );
};

export default Success;
