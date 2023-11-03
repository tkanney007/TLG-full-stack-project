import React from "react";
import Table from "../components/Table";
import Pagination from "../components/Pagination";

const Bills = () => {
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  return (
    <div style={containerStyle}>
      <Table />
      <Pagination />
    </div>
  );
};

export default Bills;
