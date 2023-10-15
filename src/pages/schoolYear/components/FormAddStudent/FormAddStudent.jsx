import React from "react";
import { Form } from "react-bootstrap";

export default function FormAddStudent({ schoolYear, handleSchoolYear }) {
  return (
    <>
      <div className="px-5">
        <Form.Group className="my-4">
          <Form.Label>School Year</Form.Label>
          <Form.Control type="text" placeholder="School Year" value={schoolYear} onChange={handleSchoolYear} />
        </Form.Group>
      </div>
    </>
  );
}
