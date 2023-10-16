import React from "react";
import { Table } from "react-bootstrap";

export default function RecapAttend({ data }) {
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
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
}
