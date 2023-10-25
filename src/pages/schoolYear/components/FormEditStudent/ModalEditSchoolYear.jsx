import React, { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { Button, Modal } from "react-bootstrap";
import { db } from "../../../../config/firebase";
import FormEditSchoolYear from "./FormEditSchoolYear";
import Swal from "sweetalert2";

export default function ModalEditSchoolYear({ data }) {
  // State Forms
  const [schoolYear, setSchoolYear] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // State Modal
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    setSchoolYear(data?.school_year);
    setStartDate(data?.start_date);
    setEndDate(data?.end_date);
  }, [data]);

  // handler
  const handleSchoolYear = (e) => setSchoolYear(e.target.value);
  const handleStartDate = (e) => setStartDate(e.target.value);
  const handleEndDate = (e) => setEndDate(e.target.value);

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateDoc(doc(db, "school_year", data.id), {
        school_year: schoolYear,
        start_date: startDate,
        end_date: endDate,
      });
      Swal.fire("Berhasil!", "Berhasil memperbarui!", "success");
      setIsLoading(false);
      setSchoolYear(data?.school_year);
      setStartDate(data?.start_date);
      setEndDate(data?.end_date);
      setShowEdit(false);
    } catch (err) {
      Swal.fire("Error!", "Telah terjadi sesuatu kesalahan!", "error");
      setIsLoading(false);
      console.log(err);
    }
  };

  const modalOnHide = () => {
    setShowEdit(false);
    setIsLoading(false);
    setSchoolYear(data?.school_year);
    setStartDate(data?.start_date);
    setEndDate(data?.end_date);
  };

  return (
    <>
      <Button className="btn-success" onClick={() => setShowEdit(true)}>
        Sunting
      </Button>

      <Modal size="xl" show={showEdit} onHide={modalOnHide}>
        <Modal.Header closeButton>
          <Modal.Title>Memperbarui Tahun Ajaran</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ zIndex: "0" }}>
          <FormEditSchoolYear
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
