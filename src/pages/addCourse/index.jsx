import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { Button, Col, Form, Row } from "react-bootstrap";
import { db } from "../../config/firebase";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import useFetchAllData from "../../hooks/query/useFetchAllData";

export default function AddCourse() {
  const [date, setDate] = useState("");
  const [year, setYear] = useState("");
  const [classroom, setClassroom] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleDate = (e) => setDate(e.target.value);
  const handleYear = (e) => setYear(e.target.value);
  const handleClassroom = (e) => setClassroom(e.target.value);

  const schoolYears = useFetchAllData("school_year");
  const { data: schoolYear } = schoolYears;

  const students = useFetchAllData("students");
  const { data: student } = students;

  const attendaces = useFetchAllData("attendance");
  const { data: attendance } = attendaces;

  const classrooms = () => {
    const dataClassrooms = student?.map((item) => {
      return item?.classroom;
    });

    let uniqueClassroom = dataClassrooms?.filter((element, index) => {
      return dataClassrooms?.indexOf(element) === index;
    });

    return uniqueClassroom;
  };

  const participants = () => {
    const students = student?.filter((e) => e?.classroom === classroom);

    const participants = [];

    students?.map((item) => {
      const attend = 0;
      const absent = 1;
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

  const filterData = attendance.filter(
    (item) => item.school_year === year && item.classroom === classroom && item.date === date
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (filterData.length !== 0) return navigate("/attendance", { state: { school_year: year, date, classroom } });
    if (filterData.length === 0) {
      await addDoc(collection(db, "attendance"), {
        school_year: year,
        date: date,
        classroom: classroom,
        participants: participants(),
      })
        .then(() => {
          Swal.fire("Success!", "Added course is successfully!", "success");
          setIsLoading(false);
          setDate("");
          setYear("");
          setClassroom("");
          navigate("/attendance", { state: { school_year: year, date, classroom } });
        })
        .catch((err) => {
          Swal.fire("Something Error!", "Something Error!", "error");
          console.log(err);
          setIsLoading(false);
          setDate("");
          setYear("");
          setClassroom("");
        });
    }
  };

  return (
    <div className="bg-body rounded border border-2 p-5" style={{ borderStyle: "dashed !important" }}>
      <Row>
        <Col>
          <Form.Group className="mb-4">
            <Form.Label>School Year</Form.Label>
            <Form.Select onChange={handleYear}>
              <option>Select School Year</option>
              {schoolYear?.map((item, id) => (
                <option key={id} value={item?.school_year}>
                  {item?.school_year}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-4">
            <Form.Label>Date</Form.Label>
            <Form.Control type="date" placeholder="Student Address" value={date} onChange={handleDate} />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Group className="mb-4">
            <Form.Label>School Year</Form.Label>
            <Form.Select onChange={handleClassroom}>
              <option>Select Classroom</option>
              {classrooms()?.map((item, id) => (
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
        disabled={!year || !date || !classroom || participants().length === 0 || isLoading}
      >
        {isLoading ? "Loading..." : "Add Course"}
      </Button>
    </div>
  );
}
