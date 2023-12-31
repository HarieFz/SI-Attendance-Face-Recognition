import React from "react";
import { Col, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import FaceRecognition from "./components/faceRecognition";
import ListData from "./components/recapAttend/ListData";
import RecapAttend from "./components/recapAttend";
import useFetchAllData from "../../hooks/query/useFetchAllData";

export default function AttendanceRoom() {
  const attendances = useFetchAllData("attendance");
  const { data, isLoading } = attendances;

  const { state } = useLocation();

  const filterData = data.filter(
    (item) =>
      item.school_year === state.school_year &&
      item.classroom === state.classroom &&
      item.date === state.date
  );

  return (
    <>
      <h4 className="mb-4">Absensi</h4>
      <div className="d-flex gap-4 mb-3">
        <p>
          <span className="fw-semibold">Tahun Ajaran</span> :{" "}
          <span className="border rounded p-2">{state.school_year}</span>
        </p>
        <p>
          <span className="fw-semibold">Minggu Ke</span> :{" "}
          <span className="border rounded p-2">{state.meetingWeek}</span>
        </p>
        <p>
          <span className="fw-semibold">Tanggal</span> :{" "}
          <span className="border rounded p-2">{state.date}</span>
        </p>
        <p>
          <span className="fw-semibold">Kelas</span> :{" "}
          <span className="border rounded p-2">{state.classroom}</span>
        </p>
      </div>
      <Row>
        {isLoading ? (
          "Loading..."
        ) : (
          <>
            <Col lg={7}>
              <div className="mx-auto bg-body border rounded mb-5">
                <RecapAttend
                  data={filterData}
                  isLoading={isLoading}
                  RenderComponent={ListData}
                />
              </div>
            </Col>
            <Col lg={5}>
              <div>
                <FaceRecognition data={filterData} isLoading={isLoading} />
              </div>
            </Col>
          </>
        )}
      </Row>
    </>
  );
}
