import React from "react";
import logo from "../assets/logo.jpg";
import { Navbar, Button } from "flowbite-react";

export default function CustomNavbar() {
  return (
    <Navbar fluid rounded>
      <Navbar.Brand href="https://flowbite-react.com">
        <img src={logo} className="mr-3 h-6 sm:h-9" alt="Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Easy Bills
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Button gradientDuoTone="purpleToBlue">log in</Button>
      </div>
      <Navbar.Collapse>
        <Navbar.Link href="#" active>
          Home
        </Navbar.Link>
        <Navbar.Link href="#">Payday</Navbar.Link>
        <Navbar.Link href="#">Bills</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
