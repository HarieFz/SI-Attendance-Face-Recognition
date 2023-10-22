import React from "react";
import { Button } from "react-bootstrap";
import { db } from "../../../config/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import ModalEditStudent from "./FormEditStudent/ModalEditStudent";
import Swal from "sweetalert2";

export default function ListData({ data }) {
  // Delete Data
  const deleteData = (id) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda tidak dapat mengembalikan data yang telah terhapus!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonText: "Batal",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(doc(db, "school_year", id));
        Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
      }
    });
  };

  return (
    <div>
      {/* body */}
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <p className="m-0">{data?.school_year}</p>
        </div>
        <div className="d-flex gap-3">
          <ModalEditStudent data={data} />
          <Button className="btn-danger" onClick={() => deleteData(data.id)}>
            Hapus
          </Button>
        </div>
      </div>
      <hr />
    </div>
  );
}
