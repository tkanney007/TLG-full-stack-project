import React, { useState } from "react";
import { Pagination as FlowbitePagination } from "flowbite-react";

function DefaultPagination() {
  const [currentPage, setCurrentPage] = useState(1);

  const onPageChange = (page) => setCurrentPage(page);

  return (
    <FlowbitePagination
      currentPage={currentPage}
      onPageChange={onPageChange}
      totalPages={100}
    />
  );
}

export default DefaultPagination;
