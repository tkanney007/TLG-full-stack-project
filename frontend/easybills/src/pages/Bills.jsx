import React from "react";
import CustomNavbar from "../components/Navbar";
import Table from "../components/Table";
import FooterCustom from "../components/Footer";

const Bills = () => {
  return (
    <div>
      <CustomNavbar />
      <Table />
      <Pagination />
      <FooterCustom />
    </div>
  );
};

export default Bills;
