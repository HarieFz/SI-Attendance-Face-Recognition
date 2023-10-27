import React from "react";
import { Col, Form, InputGroup, Row } from "react-bootstrap";
import EditUploadPhoto from "./EditUploadPhoto";

export default function FormEditStudent({
  fileInput,
  photo,
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
  // Is File
  const isFile = (input) => "File" in window && input instanceof File;

  return (
    <>
      <div className="px-5">
        {/* Form Upload Photo */}
        <Form.Label>Foto</Form.Label>
        <div className="d-flex">
          <EditUploadPhoto
            handleClick={handleClick}
            photo={photo}
            previewPhoto={previewPhoto}
            fileInput={fileInput}
            handleSelectedPhoto={handleSelectedPhoto}
          />

          {isFile(photo) ? (
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
          ) : (
            <></>
          )}
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
              <Form.Label>Nama</Form.Label>
              <Form.Control type="text" placeholder="Nama Siswa" value={name} onChange={handleName} />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col>
            {/* Form Classroom */}
            <Form.Group className="mb-4">
              <Form.Label>Kelas</Form.Label>
              <Form.Control type="text" placeholder="Kelas" value={classroom} onChange={handleClassroom} />
            </Form.Group>
          </Col>
          <Col>
            {/* Form Number Phone Parent*/}
            <Form.Label>No Hp Orang Tua</Form.Label>
            <InputGroup className="mb-4">
              <InputGroup.Text id="basic-addon1">+62</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="No Hp Orang Tua"
                value={noPhone.replace("+62", "")}
                onChange={handleNoPhone}
              />
            </InputGroup>
          </Col>
        </Row>

        {/* Form Address */}
        <Form.Group className="mb-4">
          <Form.Label>Alamat</Form.Label>
          <Form.Control as="textarea" rows={3} placeholder="Alamat Siswa" value={address} onChange={handleAddress} />
        </Form.Group>
      </div>
    </>
  );
}
