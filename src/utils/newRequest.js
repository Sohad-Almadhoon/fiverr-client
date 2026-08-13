import axios from "axios";

// Defaults to the local backend. Deployments MUST set REACT_APP_API_URL to the
// hosted API URL at build time, or the built app will call localhost.
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api/";

const isDev = process.env.NODE_ENV === "development";

const newRequest = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30000,
});

// Turns any axios failure into a sentence worth showing a user. The old code
// rendered raw Error objects (which crashed React) or nothing at all.
export const getErrorMessage = (error) => {
  if (!error) return "Something went wrong!";

  // No response at all: server down, wrong URL, CORS rejection, or offline.
  if (!error.response) {
    if (error.code === "ECONNABORTED")
      return "The server took too long to respond. Please try again.";
    if (typeof navigator !== "undefined" && navigator.onLine === false)
      return "You appear to be offline. Check your internet connection.";
    return isDev
      ? `Cannot reach the API at ${API_BASE_URL} — is the backend running, and does CLIENT_URL allow this origin?`
      : "Cannot reach the server. Please check your connection and try again.";
  }

  const { status, data } = error.response;

  // The API sends { error: "..." }; older responses were plain strings.
  if (data && typeof data === "object" && data.error) return data.error;
  if (typeof data === "string" && data.trim() && !data.startsWith("<"))
    return data;

  if (status === 401) return "You need to sign in to do that.";
  if (status === 403) return "You don't have permission to do that.";
  if (status === 404) return "Not found.";
  if (status >= 500)
    return `The server hit an error (HTTP ${status}). Please try again shortly.`;

  return `Request failed (HTTP ${status}).`;
};

// Tokens now expire after 7 days. Without this, an expired session leaves
// currentUser sitting in localStorage: the navbar keeps showing you as signed
// in while every request 401s, with no way out but clearing storage by hand.
newRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url || "";
    const isAuthCall = url.includes("/auth/");
    const wasSignedIn = !!localStorage.getItem("currentUser");

    // Not on /auth/* - a rejected login is a form error, not a dead session.
    if ((status === 401 || status === 403) && wasSignedIn && !isAuthCall) {
      localStorage.removeItem("currentUser");
      if (window.location.pathname !== "/login") {
        window.location.assign("/login?expired=1");
      }
    }
    return Promise.reject(error);
  }
);

export default newRequest;
