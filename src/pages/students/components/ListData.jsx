import React from "react";
import { Button, Table } from "react-bootstrap";
import { db } from "../../../config/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import Swal from "sweetalert2";
import ModalEditStudent from "./FormEditStudent/ModalEditStudent";

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
        await deleteDoc(doc(db, "students", id));
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
            <th>NIS</th>
            <th>Nama</th>
            <th>Kelas</th>
            <th>No Hp Orang Tua</th>
            <th>Alamat</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{item.nis}</td>
              <td>{item.name}</td>
              <td>{item.classroom}</td>
              <td>{item.no_phone}</td>
              <td>{item.address}</td>
              <td>
                <div className="d-flex gap-3">
                  <ModalEditStudent data={item} />
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
