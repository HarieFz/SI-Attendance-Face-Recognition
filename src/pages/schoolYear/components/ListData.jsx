import React from "react";
import { Button, Table } from "react-bootstrap";
import { db } from "../../../config/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import Swal from "sweetalert2";
import ModalEditSchoolYear from "./FormEditStudent/ModalEditSchoolYear";

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
      <Table responsive bordered hover className="mb-0">
        <thead>
          <tr>
            <th>No</th>
            <th>Tahun Ajaran</th>
            <th>Tanggal Mulai</th>
            <th>Tanggal Akhir</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{item.school_year}</td>
              <td>{item.start_date}</td>
              <td>{item.end_date}</td>
              <td>
                <div className="d-flex gap-3">
                  <ModalEditSchoolYear data={item} />
                  <Button className="btn-danger" onClick={() => deleteData(item.id)}>
                    Hapus
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <hr className="mt-0" />
    </div>
  );
}
