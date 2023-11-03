import React from "react";
import logo from "../assets/logo.png";
import { Navbar, Button } from "flowbite-react";
import { Link } from "react-router-dom";

export default function CustomNavbar() {
  return (
    <Navbar
      fluid
      rounded
      style={{ backgroundColor: "#1B2845", height: "120px" }}
    >
      <Navbar.Brand>
        <Link to="/">
          <img
            src={logo}
            style={{ height: "100px", width: "auto" }}
            className="mr-3 h-6 sm:h-9"
            alt="Logo"
          />
        </Link>
        <span
          className="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
          style={{ color: "white" }}
        >
          Easy Bills
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Link to="/login">
          <Button color="blue">log in</Button>
        </Link>
      </div>
      <Navbar.Collapse>
        <Navbar.Link href="/" active style={{ color: "white" }}>
          Home
        </Navbar.Link>
        <Navbar.Link href="#" style={{ color: "white" }}>
          Payday
        </Navbar.Link>
        <Navbar.Link href="/bills" style={{ color: "white" }}>
          Bills
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
