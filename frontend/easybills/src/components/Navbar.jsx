import React from "react";
import logo from "../assets/logo.jpg";
import { Navbar, Button } from "flowbite-react";
import { Link } from 'react-router-dom';

export default function CustomNavbar() {
  return (
    <Navbar fluid rounded>
      <Navbar.Brand >
      <Link to="/">
        <img src={logo} style={{ width: '75px' }} className="mr-3 h-6 sm:h-9" alt="Logo" /></Link>
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Easy Bills
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
      <Link to="/login">
      <Button gradientDuoTone="purpleToBlue">log in</Button>
      </Link>
      </div>
      <Navbar.Collapse>
        <Navbar.Link href="/" active>Home</Navbar.Link>
        <Navbar.Link href="#">Payday</Navbar.Link>
        <Navbar.Link href="/bills">Bills</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
