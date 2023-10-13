import React from "react";
import { Table } from "react-bootstrap";

export default function RecapAttend() {
  return (
    <div>
      <Table bordered hover>
        <thead>
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Classroom</th>
            <th>Date</th>
            <th>Information</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
            <td>@mdo</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}
