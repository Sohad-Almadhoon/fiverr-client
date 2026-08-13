import React from "react";
import Navbar from "./components/navbar/Navbar";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import Gigs from "./pages/gigs/Gigs";
import MyGigs from "./pages/myGigs/MyGigs";
import Orders from "./pages/orders/Orders";
import Messages from "./pages/messages/Messages";
import Message from "./pages/message/Message";
import Add from "./pages/add/Add";
import Gig from "./pages/gig/Gig";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Pay from "./pages/pay/Pay";
import Success from "./pages/success/Success";
import RouteError from "./components/routeError/RouteError";
import getCurrentUser from "./utils/getUser";

// Module scope: building it inside the component threw the whole cache away on
// every render.
const queryClient = new QueryClient();

// Pages that read currentUser._id used to crash for logged-out visitors.
const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const currentUser = getCurrentUser();
  if (!currentUser) return <Navigate to="/login" replace />;
  return children;
};

const Layout = () => {
  return (
    <div className="app">
      <QueryClientProvider client={queryClient}>
        <Navbar />
        <Outlet />
        <Footer />
      </QueryClientProvider>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <RouteError />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/gigs",
        element: <Gigs />,
      },
      {
        path: "/mygigs",
        element: (
          <ProtectedRoute>
            <MyGigs />
          </ProtectedRoute>
        ),
      },
      {
        path: "/orders",
        element: (
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        ),
      },
      {
        path: "/messages",
        element: (
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        ),
      },
      {
        path: "/message/:id",
        element: (
          <ProtectedRoute>
            <Message />
          </ProtectedRoute>
        ),
      },
      {
        path: "/add",
        element: (
          <ProtectedRoute>
            <Add />
          </ProtectedRoute>
        ),
      },
      {
        path: "/pay/:id",
        element: (
          <ProtectedRoute>
            <Pay />
          </ProtectedRoute>
        ),
      },
      {
        path: "/success",
        element: (
          <ProtectedRoute>
            <Success />
          </ProtectedRoute>
        ),
      },
      {
        path: "/gig/:id",
        element: <Gig />,
      },
    ],
  },
  {
    path: "/register",
    element: <Register />,
    errorElement: <RouteError />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <RouteError />,
  },
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
