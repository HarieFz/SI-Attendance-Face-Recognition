import React from "react";
import AuthUser from "../../utils/AuthUser";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedUser() {
  if (AuthUser.getAccessToken()) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
