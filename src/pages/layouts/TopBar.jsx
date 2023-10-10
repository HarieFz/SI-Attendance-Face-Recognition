import React from "react";
import AuthUser from "../../utils/AuthUser";
import { auth } from "../../config/firebase";
import { Button, Container, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { BiLogOut } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

export default function TopBar() {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await signOut(auth);
      AuthUser.signOut(navigate);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <Navbar expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          {/* <img src={Logo} alt="logo" /> */}
          Attendance
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="gap-5">
          <Nav className="mx-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/attendance">
              Attendance
            </Nav.Link>
            <Nav.Link as={Link} to="/register-students">
              Students
            </Nav.Link>
            <NavDropdown title="More" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/add-school-year">
                Add School Year
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/register-students">
                Recap Attendance
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Button variant="outline-primary" onClick={logout}>
            <BiLogOut /> Logout
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
