import React, { useState } from "react";
import { Form } from "react-bootstrap";
import ListData from "./components/ListData";
import Table from "./components/Table";
import useFetchAllData from "../../hooks/query/useFetchAllData";
import Banner from "../../components/Banner";

export default function RecapAttendances() {
  // Fetch Data
  const schoolYears = useFetchAllData("school_year");
  const { data: schoolYear } = schoolYears;

  const students = useFetchAllData("students");
  const { data: student } = students;

  const attendances = useFetchAllData("attendance");
  const { data: attendance } = attendances;

  // State
  const [year, setYear] = useState({});
  const [classroom, setClassroom] = useState("");

  // Handler
  const handleYear = (e) => setYear(JSON.parse(e.target.value));
  const handleClassroom = (e) => setClassroom(e.target.value);

  // Remove Duplicates Classrooms
  const getClassrooms = () => {
    const dataClassrooms = student?.map((item) => {
      return item?.classroom;
    });

    let uniqueClassroom = dataClassrooms?.filter((element, index) => {
      return dataClassrooms?.indexOf(element) === index;
    });

    return uniqueClassroom;
  };

  // Get weeks from 1 semester
  const getWeeks = () => {
    const start = new Date(year?.start_date);
    const end = new Date(year?.end_date);

    const DAY = 24 * 60 * 60 * 1000;

    const weeks = [];
    for (let newStart = start.valueOf(); newStart < end; newStart += DAY * 7) {
      const days = [];
      for (let d = newStart; d < newStart + 7 * DAY; d += DAY) {
        const v = new Date(d).toISOString().slice(0, 10);
        days.push(v);
      }
      weeks.push(days);
    }

    return weeks;
  };

  // Filter Data
  const filterData = attendance
    ?.filter((item) => item?.school_year === year?.school_year)
    ?.filter((item) => item?.classroom === classroom)
    ?.filter(
      (item) => item?.date >= year?.start_date && item.date <= year?.end_date
    )
    ?.map((item) =>
      item?.participants?.map((e) => {
        return { ...e, date: item?.date };
      })
    )
    .flat(1);

  // Reduce Data Attendances
  const reduceDatas = () => {
    const current = {};
    const finalArr = [];
    filterData.forEach((o) => {
      if (!current[o.name]) {
        current[o.name] = [];
        finalArr.push({
          nis: o.nis,
          name: o.name,
          classroom: o.classroom,
          information: current[o.name],
        });
      }
      current[o.name].push({
        attend: o?.attend,
        permission: o?.permission,
        sick: o?.sick,
        absent: o?.absent,
        date: o?.date,
      });
    });

    return finalArr;
  };

  const transformData = (array1, array2) => {
    const output = [];

    array2.forEach((student) => {
      const studentInfo = {
        nis: student.nis,
        name: student.name,
        classroom: student.classroom,
        information: [],
        total: { attend: 0, permission: 0, sick: 0, absent: 0 },
      };

      array1.forEach((week) => {
        const weekInfo = {
          attend: 0,
          permission: 0,
          sick: 0,
          absent: 0,
          date: "",
        };

        week.forEach((date) => {
          const info = student.information.find((item) => item.date === date);
          if (info) {
            weekInfo.attend += info.attend;
            weekInfo.permission += info.permission;
            weekInfo.sick += info.sick;
            weekInfo.absent += info.absent;
            weekInfo.date = date;
          }
        });

        studentInfo.information.push({ ...weekInfo });
        studentInfo.total.attend += weekInfo.attend;
        studentInfo.total.permission += weekInfo.permission;
        studentInfo.total.sick += weekInfo.sick;
        studentInfo.total.absent += weekInfo.absent;
      });

      output.push(studentInfo);
    });

    return output;
  };

  // Caller function
  const weeks = getWeeks();
  const reduceData = reduceDatas();
  const classrooms = getClassrooms();
  const transformedData = transformData(weeks, reduceData);

  return (
    <div>
      <Banner>Rekap Absensi</Banner>
      <div className="d-flex gap-3">
        <Form.Group className="mb-4">
          <Form.Label>Tahun Ajaran</Form.Label>
          <Form.Select onChange={handleYear}>
            <option>Pilih Tahun Ajaran</option>
            {schoolYear?.map((item) => (
              <option key={item?.id} value={JSON.stringify(item)}>
                {item?.school_year}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Label>Kelas</Form.Label>
          <Form.Select onChange={handleClassroom}>
            <option>Pilih Kelas</option>
            {classrooms?.map((item, id) => (
              <option key={id} value={item}>
                {item}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </div>

      {filterData?.length !== 0 ? (
        <div className="mx-auto bg-body border rounded mb-5">
          <Table
            data={transformedData}
            weeks={weeks}
            schoolYear={year?.school_year}
            classroom={classroom}
            RenderComponent={ListData}
          />
        </div>
      ) : (
        <p>
          Tidak ada data yang dapat ditampilkan.{" "}
          <span className="text-danger">
            Silahkan pilih terlebih dahulu filter di atas.
          </span>
        </p>
      )}
    </div>
  );
}
