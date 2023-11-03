import React from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

const Home = () => {
  const divStyle = {
    backgroundColor: "#111A2C",
    paddingTop: "10%",
    paddingBottom: "10%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "90vh",
  };

  const logoStyle = {
    maxWidth: "100%",
    height: "auto",
  };

  return (
    <div style={divStyle}>
      <Link to="/login">
        <img src={logo} style={logoStyle} alt="Logo" />
      </Link>
    </div>
  );
};

export default Home;
