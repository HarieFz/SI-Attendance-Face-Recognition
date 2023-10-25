import React, { Fragment } from "react";
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
            <th>Alpa</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{item?.nis}</td>
              <td>{item?.name}</td>
              <td>{item?.classroom}</td>
              {item?.information?.map((e, i) => (
                <Fragment key={i}>
                  <td>{e?.attend}</td>
                  <td>{e?.permission}</td>
                  <td>{e?.sick}</td>
                  <td>{e?.absent}</td>
                </Fragment>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
