import React, { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { Button, Modal } from "react-bootstrap";
import { db } from "../../../../config/firebase";
import FormEditStudent from "./FormEditStudent";
import Swal from "sweetalert2";

export default function ModalEditStudent({ data }) {
  // State Forms
  const [schoolYear, setSchoolYear] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // State Modal
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    setSchoolYear(data.school_year);
  }, [data]);

  // handler
  const handleSchoolYear = (e) => setSchoolYear(e.target.value);

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateDoc(doc(db, "school_year", data.id), {
        school_year: schoolYear,
      });
      Swal.fire("Success!", "Memperbarui berhasil!", "success");
      setIsLoading(false);
      setShowEdit(false);
    } catch (err) {
      Swal.fire("Something Error!", "Telah terjadi sesuatu yang error!", "error");
      setIsLoading(false);
      console.log(err);
    }
  };

  const modalOnHide = () => {
    setShowEdit(false);
    setIsLoading(false);
    setSchoolYear(data.school_year);
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
          <FormEditStudent schoolYear={schoolYear} handleSchoolYear={handleSchoolYear} />
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
