import React, { useState } from "react";
import { Button, Table } from "react-bootstrap";
import ModalEditAttend from "./ModalEditAttend";

export default function RecapAttend({ data }) {
  // State
  const [show, setShow] = useState(false);
  const [datas, setDatas] = useState([]);
  const [participant, setParticipant] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleShow = (item, e) => {
    setShow(true);
    setDatas(item);
    setParticipant(e);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (data) {
      data?.forEach((item) => {
        item?.participants?.forEach((e) => {
          if (e.absent === 1) {
            console.log(`Sent message to ${e.name}`);
          }
        });
      });
    }
  };

  return (
    <div>
      <Table bordered hover>
        <thead>
          <tr>
            <th>No</th>
            <th>NIS</th>
            <th>Name</th>
            <th>Classroom</th>
            <th>Information</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item) =>
            item?.participants?.map((e, idx) => (
              <tr key={e.id}>
                <td>{idx + 1}</td>
                <td>{e.nis}</td>
                <td>{e.name}</td>
                <td>{e.classroom}</td>
                <td>
                  {e.attend ? "Attend" : e.permission ? "Permission" : e.sick ? "Sick" : e.absent ? "Absent" : "Absent"}
                </td>
                <td>
                  <Button className="btn-success" onClick={() => handleShow(item, e)}>
                    Edit
                  </Button>
                </td>
              </tr>
            ))
          )}
          <tr>
            <td colSpan={6}>
              <div className="d-flex justify-content-center py-2">
                <Button className="w-50" onClick={handleSubmit} disabled={isLoading}>
                  Save
                </Button>
              </div>
            </td>
          </tr>
        </tbody>
      </Table>
      <ModalEditAttend data={datas} participant={participant} showEdit={show} setShowEdit={setShow} />
    </div>
  );
}
