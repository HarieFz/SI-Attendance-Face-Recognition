import React from "react";
import { Button } from "react-bootstrap";
import * as XLSX from "xlsx";

const Table = ({ data, weeks, RenderComponent }) => {
  // Transform data
  const prep = data
    ?.map((obj) =>
      obj?.information?.map((item) => {
        return {
          nis: obj?.nis,
          name: obj?.name,
          classroom: obj?.classroom,
          information: item?.attend ? "H" : item?.permission ? "I" : item?.sick ? "S" : item?.absent ? "A" : "T",
          attend: obj?.total.attend,
          permission: obj?.total.permission,
          sick: obj?.total.sick,
          absent: obj?.total.absent,
        };
      })
    )
    .flat();

  const tags = ["Minggu", "Keterangan"];
  const headers1 = ["", "", ""].concat(Array(weeks.length).fill(tags[0]).flat()).concat(Array(4).fill(tags[1]).flat());
  const headers2 = ["NIS", "Nama", "Kelas"]
    .concat(weeks.map((_, i) => i + 1))
    .concat(Array(["H", "I", "S", "A"]).flat());

  const ws_data = data?.map((item) => {
    const objByName = prep.filter((obj) => obj.name === item.name);
    let arr = [item.nis, item.name, item.classroom];
    objByName.forEach((obj) => (arr = arr.concat([obj.information])));
    return arr.concat(item.total.attend, item.total.permission, item.total.sick, item.total.absent);
  });

  ws_data.unshift(headers2);
  ws_data.unshift(headers1);

  const exportToExcel = () => {
    // to Excel
    // new workbook
    const wb = XLSX.utils.book_new();

    // create sheet with array-of-arrays to sheet method
    const ws = XLSX.utils.aoa_to_sheet(ws_data);

    // assign sheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // set column A as text
    const range = XLSX.utils.decode_range(ws["!ref"]);
    for (let i = range.s.r; i <= range.e.r; i++) {
      const ref = XLSX.utils.encode_cell({ r: i, c: 0 });
      ws[ref].z = "0";
    }

    // assign merges to sheet
    const merges = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } },
      { s: { r: 0, c: 3 }, e: { r: 0, c: 2 + weeks.length } },
      { s: { r: 0, c: 2 + weeks.length + 1 }, e: { r: 0, c: 2 + weeks.length + 4 } },
    ];

    ws["!merges"] = merges;

    // save workbook
    XLSX.writeFile(wb, "so.xlsx");
  };

  return (
    <div>
      {/* head */}
      <div className="d-flex justify-content-between px-4 pt-4">
        <h5>
          Siswa | <small style={{ fontSize: 15 }}>total {data?.length}</small>
        </h5>
        <Button variant="success" onClick={() => exportToExcel()}>
          Download Excel
        </Button>
      </div>
      <hr style={{ height: "5px", marginBottom: "0", border: "none", background: "#000000" }} />

      {/* Body */}
      <div>
        <RenderComponent data={data} weeks={weeks} />
      </div>
    </div>
  );
};

export default Table;
