import React from "react";
import Table from "../components/Table";
import Pagination from "../components/Pagination";

const Bills = () => {
  const containerStyle = {
    backgroundColor: "#111A2C",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "90vh"
  };

  return (
    <div style={containerStyle}>
      <Table />
      <Pagination />
    </div>
  );
};

export default Bills;
