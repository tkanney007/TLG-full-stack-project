import React, { useState } from "react";

const Pagination = require("flowbite-react").Pagination;

function DefaultPagination() {
  const [currentPage, setCurrentPage] = useState(1);
  // onPageChange function that sets the currentPage
  const onPageChange = (page) => setCurrentPage(page);
}

return (
  // Rendering Pagination component
  <Pagination
    currentPage={1}
    onPageChange={(page) => {
      setCurrentPage(page); // Setting the current page when changed
    }}
    totalPages={100}
  />
);
