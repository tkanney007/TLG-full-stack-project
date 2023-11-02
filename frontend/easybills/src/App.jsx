import Home from "./pages/Home";
import Login from "./pages/Login";
import { Route, Routes } from "react-router-dom";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import CustomNavbar from "./components/Navbar";
import FooterCustom from "./components/Footer";
import Bills from "./pages/Bills";


function App() {
  return (
    
    <div>
      <CustomNavbar />
      <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/login' element={<Login/>}/>
      <Route path='/bills' element={<Bills/>}/>
      </Routes>
      <FooterCustom />
    </div>
  );
}

export default App;
