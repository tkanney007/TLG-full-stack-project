import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import CustomNavbar from "./components/Navbar";
import FooterCustom from "./components/Footer";


function App() {
  return (
    
    <div>
      <CustomNavbar />
      <Routes>
        <Route></Route>
      </Routes>
      <FooterCustom />
    </div>
  );
}

export default App;
