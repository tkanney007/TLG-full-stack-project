import React, { useEffect, useState } from "react";
import { Navbar } from "flowbite-react";

("use client");

export default function DefaultNavbar() {
  return (
    <Navbar fluid rounded>
      <Navbar.Brand as={Link} href="https://flowbite-react.com">
        <img
          src="/favicon.svg"
          className="mr-3 h-6 sm:h-9"
          alt="Flowbite React Logo"
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Flowbite React
        </span>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Link href="#" active>
          Home
        </Navbar.Link>
        <Navbar.Link as={Link} href="#">
          About
        </Navbar.Link>
        <Navbar.Link href="#">Services</Navbar.Link>
        <Navbar.Link href="#">Pricing</Navbar.Link>
        <Navbar.Link href="#">Contact</Navbar.Link>
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
