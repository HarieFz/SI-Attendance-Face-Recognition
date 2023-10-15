import React from "react";
import { Button } from "react-bootstrap";

export default function AddCourse() {
  return (
    <div
      className="d-flex bg-body rounded border border-2 justify-content-center p-5"
      style={{ borderStyle: "dashed !important" }}
    >
      <Button>Add Course</Button>
    </div>
  );
}
