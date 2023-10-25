import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { Button, Modal } from "react-bootstrap";
import { db } from "../../../../config/firebase";
import FormAddSchoolYear from "./FormAddSchoolYear";
import Swal from "sweetalert2";

export default function ModalAddSchoolYear() {
  // State Forms
  const [schoolYear, setSchoolYear] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // State Modal
  const [show, setShow] = useState(false);

  // handler
  const handleSchoolYear = (e) => setSchoolYear(e.target.value);
  const handleStartDate = (e) => setStartDate(e.target.value);
  const handleEndDate = (e) => setEndDate(e.target.value);

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await addDoc(collection(db, "school_year"), {
        school_year: schoolYear,
        start_date: startDate,
        end_date: endDate,
      });
      Swal.fire("Berhasil!", "Tahun Ajaran berhasil ditambahkan!", "success");
      setIsLoading(false);
      setShow(false);
      setSchoolYear("");
    } catch (err) {
      Swal.fire("Error!", "Telah terjadi sesuatu kesalahan!", "error");
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
      <Button onClick={() => setShow(true)}>Tambah Tahun Ajaran</Button>

      <Modal size="xl" show={show} onHide={() => modalOnHide()}>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Tahun Ajaran</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormAddSchoolYear
            schoolYear={schoolYear}
            startDate={startDate}
            endDate={endDate}
            handleSchoolYear={handleSchoolYear}
            handleStartDate={handleStartDate}
            handleEndDate={handleEndDate}
          />
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex mx-auto">
            <Button className="px-5 py-2" onClick={handleSubmit} disabled={isLoading || !schoolYear}>
              {isLoading ? `Loading...` : "Simpan"}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}
