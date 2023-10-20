import React from "react";
import { Table } from "react-bootstrap";

export default function ListData({ data }) {
  return (
    <div>
      <Table responsive bordered hover className="mb-0">
        <thead>
          <tr>
            <th>No</th>
            <th>NIS</th>
            <th>Name</th>
            <th>Classroom</th>
            <th>Attend</th>
            <th>Permission</th>
            <th>Sick</th>
            <th>Absent</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{item.nis}</td>
              <td>{item.name}</td>
              <td>{item.classroom}</td>
              <td>{item.attend}</td>
              <td>{item.permission}</td>
              <td>{item.sick}</td>
              <td>{item.absent}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <hr className="mt-0" />
    </div>
  );
}
