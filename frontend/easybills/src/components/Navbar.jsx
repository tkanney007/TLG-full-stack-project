import React, { useState, useEffect } from "react";
import Navbar from "flowbite-react";
import logo from "./assets/logo.jpg";
import { Button, Navbar } from "flowbite-react";

import React from "react";
import NavbarComponent, { Button } from "flowbite-react";
import logo from "./assets/logo.jpg";

export default function CustomNavbar() {
  return (
    <NavbarComponent fluid rounded>
      <NavbarComponent.Brand href="https://flowbite-react.com">
        <img src={logo} className="mr-3 h-6 sm:h-9" alt="Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Easy Bills
        </span>
      </NavbarComponent.Brand>
      <div className="flex md:order-2">
        <Button gradientDuoTone="purpleToBlue">log in</Button>
      </div>
      <NavbarComponent.Collapse>
        <NavbarComponent.Link href="#" active>
          Home
        </NavbarComponent.Link>
        <NavbarComponent.Link href="#">Payday</NavbarComponent.Link>
        <NavbarComponent.Link href="#">Bills</NavbarComponent.Link>
      </NavbarComponent.Collapse>
    </NavbarComponent>
  );
}
