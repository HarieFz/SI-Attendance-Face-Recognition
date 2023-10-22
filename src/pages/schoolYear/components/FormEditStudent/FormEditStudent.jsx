import React from "react";
import { Form } from "react-bootstrap";

export default function FormEditStudent({ schoolYear, handleSchoolYear }) {
  return (
    <>
      <div className="px-5">
        <Form.Group className="my-4">
          <Form.Label>Tahun Ajaran</Form.Label>
          <Form.Control type="text" placeholder="2023/2024 - Ganjil" value={schoolYear} onChange={handleSchoolYear} />
        </Form.Group>
      </div>
    </>
  );
}
