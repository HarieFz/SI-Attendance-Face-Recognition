import React from "react";
import { Table } from "react-bootstrap";
import ModalEditAttend from "./ModalEditAttend";

export default function ListData({ data }) {
  return (
    <div>
      <Table responsive bordered hover className="mb-0">
        <thead>
          <tr>
            <th>No</th>
            <th>NIS</th>
            <th>Nama</th>
            <th>Kelas</th>
            <th>Keterangan</th>
            <th>Aksi</th>
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
                  {e.attend
                    ? "Hadir"
                    : e.permission
                    ? "Izin"
                    : e.sick
                    ? "Sakit"
                    : e.absent
                    ? "Tidak Hadir"
                    : "Tanpa Keterangan"}
                </td>
                <td>
                  <ModalEditAttend data={item} participant={e} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <hr className="mt-0" />
    </div>
  );
}
