import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { Button, Modal } from "react-bootstrap";
import { db } from "../../../../config/firebase";
import FormAddStudent from "./FormAddStudent";
import Swal from "sweetalert2";

export default function ModalAddStudent() {
  // State Forms
  const [schoolYear, setSchoolYear] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // State Modal
  const [show, setShow] = useState(false);

  // handler
  const handleSchoolYear = (e) => setSchoolYear(e.target.value);

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await addDoc(collection(db, "school_year"), {
        school_year: schoolYear,
      });
      Swal.fire("Success!", "Added School Year is successfully!", "success");
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
    setSchoolYear("");
  };

  return (
    <>
      <Button onClick={() => setShow(true)}>Add Student</Button>

      <Modal size="xl" show={show} onHide={() => modalOnHide()}>
        <Modal.Header closeButton>
          <Modal.Title>Add School Year</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormAddStudent schoolYear={schoolYear} handleSchoolYear={handleSchoolYear} />
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex mx-auto">
            <Button className="px-5 py-2" onClick={handleSubmit} disabled={isLoading || !schoolYear}>
              {isLoading ? `Loading...` : "Save"}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}
