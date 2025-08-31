import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy } from "react";
import React, { useState, useRef, useContext } from "react";
import { Watch } from "../Context";

import NotFound from "../pages/NotFound";

import Login from "../pages/Login";
import ResetPassword from "../pages/ResetPassword";
import RequestReset from "../pages/RequestReset";
import Dashboard from "../pages/Dashboard";
import Search from "../pages/Search";
import DocumentForm from "../pages/DocumentForm";
import QA from "../pages/QA";
import Register from "../pages/Register";
import Home from "../pages/Home";
import DocumentView from "../pages/DocumentView";
import Team from "../pages/Team";
const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token");
  return isAuthenticated ? children : <Navigate to="/login" replace={true} />;
};

const NotPrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token");
  return !isAuthenticated ? (
    children
  ) : (
    <Navigate to="/dashboard" replace={true} />
  );
};
const router = createBrowserRouter([
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
    path: "/",
    element: (
      <NotPrivateRoute>
        <Home />
      </NotPrivateRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },

  {
    path: "/teams/:teamId/documents/new",
    element: (
      <PrivateRoute>
        <DocumentForm />
      </PrivateRoute>
    ),
  },
  {
    path: "/teams/documents/:id/edit",
    element: (
      <PrivateRoute>
        <DocumentForm />
      </PrivateRoute>
    ),
  },
  {
    path: "/teams/documents/:id",
    element: (
      <PrivateRoute>
        <DocumentView />
      </PrivateRoute>
    ),
  },
  {
    path: "/qa",
    element: (
      <PrivateRoute>
        <QA />
      </PrivateRoute>
    ),
  },
  {
    path: "/team",
    element: (
      <PrivateRoute>
        <Team />
      </PrivateRoute>
    ),
  },
  {
    path: "/search",
    element: (
      <PrivateRoute>
        <Search />
      </PrivateRoute>
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
    path: "/register",
    element: (
      <NotPrivateRoute>
        <Register />
      </NotPrivateRoute>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
