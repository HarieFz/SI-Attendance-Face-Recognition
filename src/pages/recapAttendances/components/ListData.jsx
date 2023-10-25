import React, { Fragment } from "react";
import { Table } from "react-bootstrap";

export default function ListData({ data, weeks, total }) {
  return (
    <div>
      <Table responsive bordered hover className="mb-0">
        <thead>
          <tr className="text-center">
            <th rowSpan={3}>No</th>
            <th rowSpan={3}>NIS</th>
            <th rowSpan={3}>Nama</th>
            <th rowSpan={3}>Kelas</th>
            <th colSpan={weeks?.length}>Minggu</th>
            <th colSpan={4}>Keterangan</th>
          </tr>
          <tr className="text-center">
            {weeks?.map((_, i) => (
              <th key={i}>{i + 1}</th>
            ))}
            <th>H</th>
            <th>I</th>
            <th>S</th>
            <th>A</th>
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
                <td key={i}>{e?.attend ? "H" : e?.permission ? "I" : e?.sick ? "S" : e?.absent ? "A" : "T"}</td>
              ))}
              {item?.total?.map((v, i) => (
                <Fragment key={i}>
                  <td>{v?.attend}</td>
                  <td>{v?.permission}</td>
                  <td>{v?.sick}</td>
                  <td>{v?.absent}</td>
                </Fragment>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
