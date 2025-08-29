import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy } from "react";
// const Home = lazy(() => import("../pages/home"));
import Map from "../pages/Map";
import NotFound from "../pages/NotFound";
import Upload from "../pages/UploadMemory";
import Gallery from "../pages/Gallery";
import Profile from "../pages/Profile";
import GalleryDetails from "../pages/GalleryDetails";
import Login from "../pages/Login";
import SignIN from "../pages/SignIn";
import Home from "../pages/Home";
import ResetPassword from "../pages/ResetPassword";
import RequestReset from "../pages/RequestReset";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token");
  return isAuthenticated ? children : <Navigate to="/login" replace={true} />;
};

const NotPrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token");
  return !isAuthenticated ? children : <Navigate to="/map" replace={true} />;
};
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <NotPrivateRoute>
        <Home />{" "}
      </NotPrivateRoute>
    ),
  },
  {
    path: "/map",
    element: (
      <PrivateRoute>
        <Map />
      </PrivateRoute>
    ),
  },
  {
    path: "/gallery",
    element: (
      <PrivateRoute>
        <Gallery />
      </PrivateRoute>
    ),
  },
  {
    path: "/gallery/:id",
    element: (
      <PrivateRoute>
        <GalleryDetails />
      </PrivateRoute>
    ),
  },
  {
    path: "/upload",
    element: (
      <PrivateRoute>
        <Upload />
      </PrivateRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <PrivateRoute>
        <Profile />
      </PrivateRoute>
    ),
  },
  {
    path: "/reset_password",
    element: (
      <NotPrivateRoute>
        <ResetPassword />
      </NotPrivateRoute>
    ),
  },

  {
    path: "/request_reset",
    element: (
      <NotPrivateRoute>
        <RequestReset />
      </NotPrivateRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <NotPrivateRoute>
        <Login />
      </NotPrivateRoute>
    ),
  },
  {
    path: "/signin",
    element: (
      <NotPrivateRoute>
        <SignIN />
      </NotPrivateRoute>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
