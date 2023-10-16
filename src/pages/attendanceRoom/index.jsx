import React from "react";
import { Col, Row } from "react-bootstrap";
import RecapAttend from "./RecapAttend";
import FaceRecognition from "./FaceRecognition";
import useFetchAllData from "../../hooks/query/useFetchAllData";
import { useLocation } from "react-router-dom";

export default function AttendanceRoom() {
  const attendances = useFetchAllData("attendance");
  const { data, isLoading } = attendances;

  const { state } = useLocation();

  const filterData = data.filter(
    (item) => item.school_year === state.school_year && item.classroom === state.classroom && item.date === state.date
  );

  return (
    <>
      <h4 className="mb-4">Attendance Room</h4>
      <div className="d-flex gap-4 mb-3">
        <p>
          <span className="fw-semibold">School Year</span> :{" "}
          <span className="border rounded p-2">{state.school_year}</span>
        </p>
        <p>
          <span className="fw-semibold">Date</span> : <span className="border rounded p-2">{state.date}</span>
        </p>
        <p>
          <span className="fw-semibold">Classroom</span> : <span className="border rounded p-2">{state.classroom}</span>
        </p>
      </div>
      <Row>
        <Col lg={7}>{isLoading ? "Loading..." : <RecapAttend data={filterData} isLoading={isLoading} />}</Col>
        <Col lg={5}>
          <div>
            <FaceRecognition data={filterData} isLoading={isLoading} />
          </div>
        </Col>
      </Row>
    </>
  );
}
