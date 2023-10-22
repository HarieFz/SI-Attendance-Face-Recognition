import React from "react";

const Table = ({ data, RenderComponent }) => {
  return (
    <div>
      {/* head */}
      <div className="d-flex justify-content-between px-4 pt-4">
        <h5>
          Siswa | <small style={{ fontSize: 15 }}>total {data?.length}</small>
        </h5>
      </div>
      <hr style={{ height: "5px", marginBottom: "0", border: "none", background: "#000000" }} />

      {/* Body */}
      <div>
        <RenderComponent data={data} />
      </div>
    </div>
  );
};

export default Table;
