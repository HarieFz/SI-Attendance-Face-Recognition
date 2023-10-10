import React from "react";
import TopBar from "./TopBar";
import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";

export default function Layout() {
  return (
    <div>
      <TopBar />
      <Container className="py-3 px-5">
        <Outlet />
      </Container>
    </div>
  );
}
