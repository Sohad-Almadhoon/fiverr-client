import React, { useState } from "react";
import "./Login.scss";
import { useNavigate, useSearchParams } from "react-router-dom";
import newRequest, { getErrorMessage } from "../../utils/newRequest";
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  // Set by the 401 interceptor when a session expires mid-session.
  const expired = searchParams.get("expired") === "1";

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError("Please enter both your username and password.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await newRequest.post("/auth/login", {
        username,
        password,
      });
      localStorage.setItem("currentUser", JSON.stringify(res.data));
      navigate("/");
    } catch (err) {
      // A string, not the Error object: rendering the object crashed React with
      // "Objects are not valid as a React child".
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h1>Sign in</h1>
        {expired && !error && (
          <div className="formNotice">
            Your session expired. Please sign in again.
          </div>
        )}
        <label htmlFor="">Username</label>
        <input
          name="username"
          type="text"
          placeholder="johndoe"
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="">Password</label>
        <input
          name="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={submitting}>
          {submitting ? "Signing in..." : "Login"}
        </button>
        {error && <div className="formError">{error}</div>}
      </form>
    </div>
  );
}

export default Login;
