import React, { useState } from "react";
import { Button } from "react-bootstrap";
import ModalAddStudent from "./FormAddStudent/ModalAddStudent";

const Table = ({ data, RenderComponent, contentPerPage }) => {
  // State Pagination
  const [totalPageCount] = useState(Math.ceil(data.length / contentPerPage));
  const [currentPage, setCurrentPage] = useState(1);

  // State Modal
  const [show, setShow] = useState(false);

  // Pagination
  function goToNextPage() {
    setCurrentPage((page) => page + 1);
  }
  function gotToPreviousPage() {
    setCurrentPage((page) => page - 1);
  }
  const getPaginatedData = () => {
    const startIndex = currentPage * contentPerPage - contentPerPage;
    const endIndex = startIndex + contentPerPage;
    return data.slice(startIndex, endIndex);
  };

  return (
    <div>
      {/* head */}
      <div className="d-flex justify-content-between px-4 pt-4">
        <h5>
          List School Year | <small style={{ fontSize: 15 }}>total {data?.length}</small>
        </h5>
        <div>
          <Button onClick={() => setShow(true)}>Add Student</Button>
        </div>
      </div>
      <hr style={{ height: "5px", border: "none", background: "#000000" }} />

      {/* Body */}
      <div>
        {getPaginatedData().map((dataItem, index) => (
          <RenderComponent key={index} data={dataItem} />
        ))}
      </div>

      {/* footer */}
      <div className="d-flex justify-content-between px-4 pb-4">
        <div className="mb-0 py-1 text-black-50">1 - 10 of {data?.length} students</div>
        <div className="mb-0 py-1 text-black-50">
          {currentPage} of {totalPageCount} pages
        </div>
        <div className="d-flex gap-3">
          <Button className="btn-dark" onClick={gotToPreviousPage} disabled={currentPage === 1}>
            Prev
          </Button>
          <Button className="btn-dark" onClick={goToNextPage} disabled={currentPage === totalPageCount}>
            Next
          </Button>
        </div>
      </div>
      <ModalAddStudent show={show} setShow={setShow} />
    </div>
  );
};

export default Table;
