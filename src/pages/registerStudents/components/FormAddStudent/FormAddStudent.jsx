import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import UploadPhoto from "./UploadPhoto";

export default function FormAddStudent({
  fileInput,
  previewPhoto,
  nis,
  name,
  classroom,
  noPhone,
  address,
  isRunningFaceDetector,
  detectionCount,
  handleSelectedPhoto,
  handleClick,
  handleNis,
  handleName,
  handleClassroom,
  handleNoPhone,
  handleAddress,
}) {
  return (
    <>
      <div className="px-5">
        {/* Form Upload Photo */}
        <Form.Label>Photo</Form.Label>
        <div className="d-flex">
          <UploadPhoto
            handleClick={handleClick}
            previewPhoto={previewPhoto}
            fileInput={fileInput}
            handleSelectedPhoto={handleSelectedPhoto}
          />

          <div className="ms-3">
            <p className="mb-0">
              Number of detection: {isRunningFaceDetector ? <>Detecting face... Loading...</> : detectionCount}
            </p>
            {detectionCount === 1 && <p className="text-success fw-semibold">Face Detected</p>}
            {detectionCount > 1 && <p className="text-danger fw-semibold">Only Single Face Allowed</p>}
            {detectionCount === 0 && !isRunningFaceDetector ? (
              <p className="text-danger fw-semibold">No Face Detected</p>
            ) : null}
          </div>
        </div>

        <Row>
          <Col>
            {/* Form NIS */}
            <Form.Group className="my-4">
              <Form.Label>NIS</Form.Label>
              <Form.Control type="text" placeholder="NIS" value={nis} onChange={handleNis} />
            </Form.Group>
          </Col>
          <Col>
            {/* Form Name */}
            <Form.Group className="my-4">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Student Name" value={name} onChange={handleName} />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col>
            {/* Form Classroom */}
            <Form.Group className="mb-4">
              <Form.Label>Classroom</Form.Label>
              <Form.Control type="text" placeholder="Student Classroom" value={classroom} onChange={handleClassroom} />
            </Form.Group>
          </Col>
          <Col>
            {/* Form Number Phone Parent*/}
            <Form.Group className="mb-4">
              <Form.Label>Number Phone Parent</Form.Label>
              <Form.Control type="text" placeholder="Number Phone Parent" value={noPhone} onChange={handleNoPhone} />
            </Form.Group>
          </Col>
        </Row>

        {/* Form Address */}
        <Form.Group className="mb-4">
          <Form.Label>Address</Form.Label>
          <Form.Control as="textarea" rows={3} placeholder="Student Address" value={address} onChange={handleAddress} />
        </Form.Group>
      </div>
    </>
  );
}
