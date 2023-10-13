import React from "react";
import { Col, Row } from "react-bootstrap";
import RecapAttend from "./RecapAttend";
import FaceRecognition from "./FaceRecognition";

export default function AttendanceRoom() {
  // const [show, setShow] = useState(true);

  return (
    <>
      <h4 className="mb-4">Attendance Room</h4>
      <Row>
        <Col lg={7}>
          <RecapAttend />
        </Col>
        <Col lg={5}>
          <div className="bg-body border p-3">
            <FaceRecognition />
          </div>
        </Col>
      </Row>
    </>
  );
}
