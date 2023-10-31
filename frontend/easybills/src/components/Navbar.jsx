import React, { useEffect, useState } from "react";
import  Navbar  from "flowbite-react";
import logo from './assets/logo.jpg';


("use client");

import { Button, Navbar } from "flowbite-react";

export default function NavbarWithCTAButton() {
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

// const Navbar = () => {
//   return (
//     <nav className="bg-gray-800 p-4">
//       <div className="container mx-auto flex justify-between items-center">
//         <div className="text-white text-2xl font-bold">Easy Bills</div>
//         <ul className="flex space-x-4">
//           <li><a href="/" className="text-white hover:text-gray-300">Home</a></li>
//           <li><a href="/My Bills" className="text-white hover:text-gray-300">My Bills</a></li>
//           <li><a href="/My Paydays" className="text-white hover:text-gray-300">My Paydays</a></li>
//           <li><a href="/Log in" className="text-white hover:text-gray-300">Log in</a></li>
//         </ul>
//       </div>
//     </nav>
//   );
// };
