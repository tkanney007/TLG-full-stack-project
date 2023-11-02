import React from "react";
import logo from "../assets/logo.jpg";
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <Link to="/login">
      <img src={logo} className="mr-3 h-6 sm:h-9" alt="Logo" />
      </Link>
    </div>
  );
};

export default Home;
