import React, { useState } from "react";
import { Button, Table } from "react-bootstrap";
import { db } from "../../../config/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import Swal from "sweetalert2";
import ModalEditStudent from "./FormEditStudent/ModalEditStudent";

export default function ListData({ data }) {
  // State
  const [datas, setDatas] = useState({});
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

  const handleShow = (item) => {
    setShow(true);
    setDatas(item);
  };

  return (
    <div>
      <Table responsive bordered hover className="mb-0">
        <thead>
          <tr>
            <th>No</th>
            <th>NIS</th>
            <th>Name</th>
            <th>Classroom</th>
            <th>No Phone Parent</th>
            <th>Address</th>
            <th>Action</th>
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
                  <Button className="btn-success" onClick={() => handleShow(item)}>
                    Edit
                  </Button>
                  <Button className="btn-danger" onClick={() => deleteData(item.id)}>
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <hr className="mt-0" />
      <ModalEditStudent show={show} setShow={setShow} data={datas} />
    </div>
  );
}
