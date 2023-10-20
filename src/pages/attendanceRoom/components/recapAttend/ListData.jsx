import React, { useState } from "react";
import { Button, Table } from "react-bootstrap";
import ModalEditAttend from "./ModalEditAttend";

export default function ListData({ data }) {
  // State
  const [show, setShow] = useState(false);
  const [datas, setDatas] = useState([]);
  const [participant, setParticipant] = useState([]);

  const handleShow = (item, e) => {
    setShow(true);
    setDatas(item);
    setParticipant(e);
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
        </tbody>
      </Table>

      <hr className="mt-0" />
      <ModalEditAttend data={datas} participant={participant} showEdit={show} setShowEdit={setShow} />
    </div>
  );
}
