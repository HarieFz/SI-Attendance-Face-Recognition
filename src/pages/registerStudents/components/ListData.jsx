import React from "react";
import { Button } from "react-bootstrap";

export default function ListData({ data }) {
  const { name, classroom } = data;
  return (
    <div>
      {/* body */}
      <div className="px-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <p className="m-0 fw-bold">{name}</p>
            <p className="m-0 text-black-50">{classroom}</p>
          </div>
          <div className="d-flex gap-3">
            <Button className="btn-success">Edit</Button>
            <Button className="btn-danger">Delete</Button>
          </div>
        </div>
        <hr />
      </div>
    </div>
  );
}
