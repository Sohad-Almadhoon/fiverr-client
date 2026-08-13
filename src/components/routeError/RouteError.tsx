import React from "react";
import { useRouteError, Link } from "react-router-dom";

// Wired in as `errorElement` on every top-level route. Without it, a crash
// inside any page renders React Router's blank "Unexpected Application Error"
// screen with no hint about what went wrong.
const RouteError: React.FC = () => {
  const error = useRouteError() as any;
  const message =
    error?.message ||
    error?.statusText ||
    (typeof error === "string" ? error : "An unexpected error occurred.");

  return (
    <div
      style={{
        maxWidth: 720,
        margin: "80px auto",
        padding: "0 24px",
        fontFamily: "inherit",
      }}>
      <h1 style={{ color: "#404145", marginBottom: 12 }}>
        Something went wrong on this page
      </h1>
      <div
        style={{
          padding: "16px 18px",
          border: "1px solid #e0b4b4",
          borderLeft: "4px solid #d0021b",
          borderRadius: 4,
          background: "#fff6f6",
          color: "#9f3a38",
          lineHeight: 1.6,
          wordBreak: "break-word",
        }}>
        {message}
      </div>
      <p style={{ color: "#62646a", marginTop: 20, lineHeight: 1.6 }}>
        The rest of the app still works. Try going back to the home page, and
        check the browser console for the full stack trace.
      </p>
      <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
        <Link to="/">
          <button
            style={{
              border: "none",
              padding: "14px 22px",
              color: "white",
              fontSize: 16,
              background: "#1dbf73",
              cursor: "pointer",
              borderRadius: 4,
            }}>
            Go home
          </button>
        </Link>
        <button
          onClick={() => window.location.reload()}
          style={{
            border: "1px solid #dadbdd",
            padding: "14px 22px",
            fontSize: 16,
            background: "white",
            cursor: "pointer",
            borderRadius: 4,
          }}>
          Reload
        </button>
      </div>
    </div>
  );
};

export default RouteError;
