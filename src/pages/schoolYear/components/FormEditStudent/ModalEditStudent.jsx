import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { Button, Modal } from "react-bootstrap";
import { db } from "../../../../config/firebase";
import FormEditStudent from "./FormEditStudent";
import Swal from "sweetalert2";

export default function ModalEditStudent({ show, setShow, data }) {
  // Data from Firestore
  const { id, data: item } = data;

  // State Forms
  const [schoolYear, setSchoolYear] = useState(item.school_year);
  const [isLoading, setIsLoading] = useState(false);

  // handler
  const handleSchoolYear = (e) => setSchoolYear(e.target.value);

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateDoc(doc(db, "school_year", id), {
        school_year: schoolYear,
      });
      Swal.fire("Success!", "Updated School Year is successfully!", "success");
      setIsLoading(false);
      setShow(false);
      setSchoolYear("");
    } catch (err) {
      Swal.fire("Something Error!", "Something Error!", "error");
      setIsLoading(false);
      console.log(err);
    }
  };

  // Clear State Modal on Hide
  const modalOnHide = () => {
    setShow(false);
    setIsLoading(false);
    setSchoolYear();
  };

  return (
    <Modal size="xl" show={show} onHide={() => modalOnHide()}>
      <Modal.Header closeButton>
        <Modal.Title>Update School Year</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ zIndex: "0" }}>
        <FormEditStudent schoolYear={schoolYear} handleSchoolYear={handleSchoolYear} />
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex mx-auto">
          <Button className="px-5 py-2" onClick={handleSubmit} disabled={isLoading || !schoolYear}>
            {isLoading ? `Loading...` : "Save"}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
