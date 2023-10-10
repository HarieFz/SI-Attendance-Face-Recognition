import React from "react";
import { Form } from "react-bootstrap";
import UploadPhoto from "./UploadPhoto";

export default function FormAddStudent({
  fileInput,
  previewPhoto,
  name,
  classroom,
  detectionCount,
  isRunningFaceDetector,
  handleSelectedPhoto,
  handleName,
  handleClassroom,
  handleClick,
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

        {/* Form Name */}
        <Form.Group className="my-4">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" placeholder="Student Name" value={name} onChange={handleName} />
        </Form.Group>

        {/* Form Classroom */}
        <Form.Group className="mb-4">
          <Form.Label>Classroom</Form.Label>
          <Form.Control type="text" placeholder="Student Classroom" value={classroom} onChange={handleClassroom} />
        </Form.Group>
      </div>
    </>
  );
}
