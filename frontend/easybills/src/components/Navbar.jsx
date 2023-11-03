import React from "react";
import logo from "../assets/logo.jpg";
import { Navbar, Button } from "flowbite-react";
import { Link } from "react-router-dom";

export default function CustomNavbar() {
  return (
    <Navbar
      fluid
      style={{ backgroundColor: "#141d46", height: "100px" }}
    >
      <Navbar.Brand>
        <Link to="/">
          <img
            src={logo}
            style={{ height: "80px", width: "auto" }}
            className="mr-3 h-6 sm:h-9"
            alt="Logo"
          />
        </Link>
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Easy Bills
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Link to="/login">
          <Button gradientDuoTone="purpleToBlue" className="flex">log in</Button>
        </Link>
      </div>
      <Navbar.Collapse>
        <Navbar.Link href="/" active className="flex">Home</Navbar.Link>
        <Navbar.Link href="#" active className="flex">Payday</Navbar.Link>
        <Navbar.Link href="/bills" active className="flex">Bills</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
