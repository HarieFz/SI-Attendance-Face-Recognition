import React, { useState } from "react";
import ModalAddStudent from "./FormAddStudent/ModalAddStudent";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

const Table = ({ data, RenderComponent, contentPerPage }) => {
  // State Pagination
  const [totalPageCount] = useState(Math.ceil(data?.length / contentPerPage));
  const [currentPage, setCurrentPage] = useState(1);

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
    return data?.slice(startIndex, endIndex);
  };

  return (
    <div>
      {/* head */}
      <div className="d-flex justify-content-between px-4 pt-4">
        <h5>
          Siswa | <small style={{ fontSize: 15 }}>total {data?.length}</small>
        </h5>
        <div>
          <ModalAddStudent />
        </div>
      </div>
      <hr style={{ height: "5px", marginBottom: "0", border: "none", background: "#000000" }} />

      {/* Body */}
      <div>
        <RenderComponent data={getPaginatedData()} />
      </div>

      {/* footer */}
      <div className="d-flex justify-content-between px-4 pb-4">
        <div className="mb-0 py-1 text-black-50">1 - 10 dari {data?.length} siswa</div>
        <div className="mb-0 py-1 text-black-50">
          {currentPage} dari {totalPageCount} halaman
        </div>
        <div className="d-flex gap-3">
          <button className="border-0 bg-white" onClick={gotToPreviousPage} disabled={currentPage === 1}>
            <BsChevronLeft />
          </button>
          <button className="border-0 bg-white" onClick={goToNextPage} disabled={currentPage === totalPageCount}>
            <BsChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;
