import React, { useEffect, useState } from "react";



const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold">Easy Bills</div>
        <ul className="flex space-x-4">
          <li><a href="/" className="text-white hover:text-gray-300">Home</a></li>
          <li><a href="/My Bills" className="text-white hover:text-gray-300">My Bills</a></li>
          <li><a href="/My Paydays" className="text-white hover:text-gray-300">My Paydays</a></li>
          <li><a href="/Log in" className="text-white hover:text-gray-300">Log in</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
