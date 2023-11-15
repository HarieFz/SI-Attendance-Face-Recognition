import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { Button, Col, Form, Row } from "react-bootstrap";
import { db } from "../../config/firebase";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import useFetchAllData from "../../hooks/query/useFetchAllData";
import Banner from "../../components/Banner";

export default function AddCourse() {
  const [date, setDate] = useState("");
  const [year, setYear] = useState([]);
  const [classroom, setClassroom] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleYear = (e) => setYear(JSON.parse(e.target.value));
  const handleDate = (e) => setDate(e.target.value);
  const handleClassroom = (e) => setClassroom(e.target.value);

  const schoolYears = useFetchAllData("school_year");
  const { data: schoolYear } = schoolYears;

  const students = useFetchAllData("students");
  const { data: student } = students;

  const attendances = useFetchAllData("attendance");
  const { data: attendance } = attendances;

  const getClassrooms = () => {
    const dataClassrooms = student?.map((item) => {
      return item?.classroom;
    });

    let uniqueClassroom = dataClassrooms?.filter((element, index) => {
      return dataClassrooms?.indexOf(element) === index;
    });

    return uniqueClassroom;
  };

  const getParticipants = () => {
    const students = student?.filter((e) => e?.classroom === classroom);

    const participants = [];

    students?.map((item) => {
      const attend = 0;
      const absent = 0;
      const permission = 0;
      const sick = 0;

      return participants.push({
        ...item,
        attend,
        absent,
        permission,
        sick,
      });
    });

    return participants;
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

  const validateExistAttend = () => {
    const weeks = getWeeks();
    const indexOfDate = [];
    attendance?.map((attend) => {
      const index = weeks.map((e) => e.findIndex((v) => v === attend.date));
      const getIndex = index.findIndex((e) => e > -1);
      return indexOfDate.push(getIndex);
    });

    const index = weeks.map((e) => e.findIndex((v) => v === date));
    const getIndex = index.findIndex((e) => e > -1);

    return indexOfDate.includes(getIndex);
  };

  console.log(validateExistAttend());

  const participants = getParticipants();
  const classrooms = getClassrooms();
  const filterData = attendance.filter(
    (item) =>
      item.school_year === year?.school_year &&
      item.classroom === classroom &&
      item.date === date
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (filterData.length !== 0)
      return navigate("/attendance", {
        state: { school_year: year?.school_year, date, classroom },
      });
    if (filterData.length === 0) {
      await addDoc(collection(db, "attendance"), {
        school_year: year.school_year,
        date: date,
        classroom: classroom,
        participants: participants,
      })
        .then(() => {
          Swal.fire("Berhasil!", "Berhasil membuat pertemuan!", "success");
          setIsLoading(false);
          setDate("");
          setYear([]);
          setClassroom("");
          navigate("/attendance", {
            state: { school_year: year.school_year, date, classroom },
          });
        })
        .catch((err) => {
          Swal.fire("Error!", "Telah terjadi sesuatu kesalahan!", "error");
          console.log(err);
          setIsLoading(false);
          setDate("");
          setYear([]);
          setClassroom("");
        });
    }
  };

  return (
    <>
      <Banner>Buat Pertemuan</Banner>
      <div
        className="bg-body rounded border border-2 p-5"
        style={{ borderStyle: "dashed !important" }}
      >
        <Row>
          <Col>
            <Form.Group className="mb-4">
              <Form.Label>Tanggal</Form.Label>
              <Form.Control
                type="date"
                placeholder="Student Address"
                value={date}
                onChange={handleDate}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-4">
              <Form.Label>Tahun Ajaran</Form.Label>
              <Form.Select onChange={handleYear}>
                <option>Pilih Tahun Ajaran</option>
                {schoolYear?.map((item, id) => (
                  <option key={id} value={JSON.stringify(item)}>
                    {item?.school_year}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col>
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
          </Col>
          <Col>
            <></>
          </Col>
        </Row>
        <Button
          onClick={handleSubmit}
          disabled={
            !year ||
            !date ||
            !classroom ||
            participants.length === 0 ||
            isLoading
          }
        >
          {isLoading ? "Loading..." : "Lanjutkan"}
        </Button>
      </div>
    </>
  );
}
