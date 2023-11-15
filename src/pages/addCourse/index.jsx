import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { Button, Col, Form, Row } from "react-bootstrap";
import { db } from "../../config/firebase";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import useFetchAllData from "../../hooks/query/useFetchAllData";
import Banner from "../../components/Banner";

export default function AddCourse() {
  // Fetching Data Firestore
  const schoolYears = useFetchAllData("school_year");
  const { data: schoolYear } = schoolYears;

  const students = useFetchAllData("students");
  const { data: student } = students;

  const attendances = useFetchAllData("attendance");
  const { data: attendance } = attendances;

  // State
  const [date, setDate] = useState("");
  const [year, setYear] = useState({});
  const [classroom, setClassroom] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Handler
  const handleClassroom = (e) => setClassroom(e.target.value);
  const handleDate = (e) => {
    setDate(e.target.value);
    schoolYear?.map((item) => {
      if (
        e.target.value >= item.start_date &&
        e.target.value <= item.end_date
      ) {
        setYear(item);
      }
    });
  };

  // Get Classrooms
  const getClassrooms = () => {
    const dataClassrooms = student?.map((item) => {
      return item?.classroom;
    });

    let uniqueClassroom = dataClassrooms?.filter((element, index) => {
      return dataClassrooms?.indexOf(element) === index;
    });

    return uniqueClassroom;
  };

  // Get Participants
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

  // Get Meeting Week
  const getMeetingWeek = () => {
    const weeks = getWeeks();
    const index = weeks.map((e) => e.findIndex((v) => v === date));
    const getIndex = index?.findIndex((e) => e > -1);

    return getIndex + 1;
  };

  // Validate if meeting week is exist
  const validateMeetingWeek = () => {
    const meetingWeek = getMeetingWeek();
    const attendByClass = attendance?.filter(
      (item) => item.classroom === classroom
    );
    const existDate = attendByClass.filter(
      (item) => item.meeting_week === meetingWeek
    );

    return existDate[0]?.date === date ? null : existDate[0];
  };

  // Caller Function
  const participants = getParticipants();
  const classrooms = getClassrooms();
  const meetingWeek = getMeetingWeek();
  const validatedMeetingWeek = validateMeetingWeek();
  const filterData = attendance.filter(
    (item) =>
      item.school_year === year?.school_year &&
      item.classroom === classroom &&
      item.date === date
  );

  // Handler Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (filterData.length !== 0)
      return navigate("/attendance", {
        state: { school_year: year?.school_year, date, meetingWeek, classroom },
      });
    if (filterData.length === 0) {
      await addDoc(collection(db, "attendance"), {
        school_year: year.school_year,
        date: date,
        meeting_week: meetingWeek,
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
            state: {
              school_year: year.school_year,
              date,
              meetingWeek,
              classroom,
            },
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
              {validatedMeetingWeek !== null && validatedMeetingWeek ? (
                <p className="text-danger" style={{ fontSize: "12px" }}>
                  Minggu ke-{validatedMeetingWeek?.meeting_week} telah dibuat
                  pada tanggal {validatedMeetingWeek?.date}
                </p>
              ) : (
                <></>
              )}
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-4">
              <Form.Label>Tahun Ajaran</Form.Label>
              <Form.Control
                className="bg-light"
                value={year.school_year ? year.school_year : "-"}
                disabled
              />
            </Form.Group>
          </Col>
        </Row>

        <Button
          onClick={handleSubmit}
          disabled={
            !year ||
            !date ||
            !classroom ||
            participants.length === 0 ||
            validatedMeetingWeek ||
            isLoading
          }
        >
          {isLoading ? "Loading..." : "Lanjutkan"}
        </Button>
      </div>
    </>
  );
}
