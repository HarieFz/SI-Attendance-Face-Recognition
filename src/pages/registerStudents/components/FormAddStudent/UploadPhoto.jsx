import React from "react";
import { Form } from "react-bootstrap";
import { AiOutlineCloudUpload } from "react-icons/ai";

export default function UploadPhoto({ handleClick, previewPhoto, fileInput, handleSelectedPhoto }) {
  return (
    <div className="d-flex" style={{ width: "150px", height: "150px" }} onClick={handleClick}>
      <div className="rounded-circle shadow" style={{ cursor: "pointer", width: "150px", height: "150px" }}>
        {previewPhoto ? (
          <img
            src={previewPhoto}
            alt="Preview"
            className="rounded-circle p-1"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div className="text-center text-black-50" style={{ marginTop: "35px" }}>
            <AiOutlineCloudUpload size="50px" />
            <p>Upload Photo</p>
          </div>
        )}
      </div>

      <Form.Group>
        <Form.Control
          type="file"
          ref={fileInput}
          className="d-none"
          onChange={handleSelectedPhoto}
          accept=".jpg, .jpeg, .png"
        />
      </Form.Group>
    </div>
  );
}
