import React from "react";
import AuthUser from "../../utils/AuthUser";
import { Navigate, Outlet } from "react-router-dom";
import Layout from "../../pages/layouts/Layout";

export default function PrivateUser() {
  if (!AuthUser.isAuthorization()) {
    return <Navigate to="/login" />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
