import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { db } from "../../../config/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import Swal from "sweetalert2";
import ModalEditStudent from "./FormEditStudent/ModalEditStudent";

export default function ListData({ data }) {
  // Data
  const { id, nis, name, classroom, no_phone, address } = data;

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
        await deleteDoc(doc(db, "students", id));
        Swal.fire("Deleted!", "File has been deleted.", "success");
      }
    });
  };

  return (
    <div>
      {/* body */}
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <p className="m-0 fw-bold">{nis}</p>
          <p className="m-0 fw-bold">{name}</p>
          <p className="m-0 text-black-50">{classroom}</p>
          <p className="m-0 text-black-50">{no_phone}</p>
          <p className="m-0 text-black-50">{address}</p>
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
      <ModalEditStudent show={show} setShow={setShow} data={data} />
    </div>
  );
}
