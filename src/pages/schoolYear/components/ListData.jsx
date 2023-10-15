import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { db } from "../../../config/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import ModalEditStudent from "./FormEditStudent/ModalEditStudent";
import Swal from "sweetalert2";

export default function ListData({ data }) {
  // Data
  const { id, data: item } = data;

  // Modal
  const [show, setShow] = useState(false);

  // Delete Data
  const deleteData = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(doc(db, "school_year", id));
        Swal.fire("Deleted!", "File has been deleted.", "success");
      }
    });
  };

  return (
    <div>
      {/* body */}
      <div className="px-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <p className="m-0">{item.school_year}</p>
          </div>
          <div className="d-flex gap-3">
            <Button className="btn-success" onClick={() => setShow(true)}>
              Edit
            </Button>
            <Button className="btn-danger" onClick={() => deleteData(id)}>
              Delete
            </Button>
          </div>
        </div>
        <hr />
      </div>
      <ModalEditStudent show={show} setShow={setShow} data={data} />
    </div>
  );
}
