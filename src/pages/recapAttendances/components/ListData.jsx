import React from "react";
import { Table } from "react-bootstrap";

export default function ListData({ data }) {
  return (
    <div>
      <Table responsive bordered hover className="mb-0">
        <thead>
          <tr className="text-center">
            <th rowSpan={3}>No</th>
            <th rowSpan={3}>NIS</th>
            <th rowSpan={3}>Nama</th>
            <th rowSpan={3}>Kelas</th>
            <th colSpan={4}>Keterangan</th>
          </tr>
          <tr className="text-center">
            <th>Hadir</th>
            <th>Izin</th>
            <th>Sakit</th>
            <th>Tidak Hadir</th>
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
    </div>
  );
}
