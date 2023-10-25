import React from "react";
import { Col, Form, Row } from "react-bootstrap";

export default function FormEditSchoolYear({
  schoolYear,
  startDate,
  endDate,
  handleSchoolYear,
  handleStartDate,
  handleEndDate,
}) {
  return (
    <>
      <div className="px-5">
        <Form.Group className="my-4">
          <Form.Label>Tahun Ajaran</Form.Label>
          <Form.Control type="text" placeholder="2023/2024 - Ganjil" value={schoolYear} onChange={handleSchoolYear} />
        </Form.Group>

        <Row>
          <Col>
            <Form.Group className="my-4">
              <Form.Label>Tanggal Mulai</Form.Label>
              <Form.Control type="date" value={startDate} onChange={handleStartDate} />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="my-4">
              <Form.Label>Tanggal Akhir</Form.Label>
              <Form.Control type="date" value={endDate} onChange={handleEndDate} />
            </Form.Group>
          </Col>
        </Row>
      </div>
    </>
  );
}
