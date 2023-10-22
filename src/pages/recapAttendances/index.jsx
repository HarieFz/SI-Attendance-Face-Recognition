import React, { useState } from "react";
import useFetchAllData from "../../hooks/query/useFetchAllData";
import Table from "./components/Table";
import ListData from "./components/ListData";
import { Form } from "react-bootstrap";

export default function RecapAttendances() {
  // Fetch Data
  const schoolYears = useFetchAllData("school_year");
  const { data: schoolYear } = schoolYears;

  const students = useFetchAllData("students");
  const { data: student } = students;

  const attendances = useFetchAllData("attendance");
  const { data: attendance } = attendances;

  // State
  const [year, setYear] = useState("");
  const [classroom, setClassroom] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");

  // Handler
  const handleYear = (e) => setYear(e.target.value);
  const handleClassroom = (e) => setClassroom(e.target.value);
  const handleDateStart = (e) => setDateStart(e.target.value);
  const handleDateEnd = (e) => setDateEnd(e.target.value);

  // Remove Duplicates Classrooms
  const classrooms = () => {
    const dataClassrooms = student?.map((item) => {
      return item?.classroom;
    });

    let uniqueClassroom = dataClassrooms?.filter((element, index) => {
      return dataClassrooms?.indexOf(element) === index;
    });

    return uniqueClassroom;
  };

  // Filter Data
  const filterData = attendance
    ?.filter((item) => item?.school_year === year)
    ?.filter((item) => item?.classroom === classroom)
    ?.filter((item) => item?.date >= dateStart && item.date <= dateEnd)
    ?.map((item) => item?.participants?.map((e) => e))
    .flat(1);

  // Reduce Data
  const res = () => {
    const group = {};

    filterData.forEach((e) => {
      const o = (group[e.name] = group[e.name] || { ...e, attend: 0, permission: 0, sick: 0, absent: 0 });
      o.attend += e.attend;
      o.permission += e.permission;
      o.sick += e.sick;
      o.absent += e.absent;
    });

    return Object.values(group);
  };

  return (
    <div>
      <div className="d-flex gap-3">
        <Form.Group className="mb-4">
          <Form.Label>Tahun Ajaran</Form.Label>
          <Form.Select onChange={handleYear}>
            <option>Pilih Tahun Ajaran</option>
            {schoolYear?.map((item, id) => (
              <option key={id} value={item?.school_year}>
                {item?.school_year}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Label>Kelas</Form.Label>
          <Form.Select onChange={handleClassroom}>
            <option>Pilih Kelas</option>
            {classrooms()?.map((item, id) => (
              <option key={id} value={item}>
                {item}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Label>Tanggal Mulai</Form.Label>
          <Form.Control type="date" placeholder="Student Address" value={dateStart} onChange={handleDateStart} />
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Label>Tanggal Akhir</Form.Label>
          <Form.Control type="date" placeholder="Student Address" value={dateEnd} onChange={handleDateEnd} />
        </Form.Group>
      </div>

      {filterData?.length !== 0 ? (
        <div className="mx-auto bg-body border rounded mb-5">
          <Table data={res()} RenderComponent={ListData} />
        </div>
      ) : (
        <p>
          Tidak ada data yang dapat ditampilkan.{" "}
          <span className="text-danger">Silahkan pilih terlebih dahulu filter di atas.</span>
        </p>
      )}
    </div>
  );
}
