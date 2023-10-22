import React, { useState } from "react";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { Button, Form, Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { db } from "../../../../config/firebase";

export default function ModalEditAttend({ data, participant }) {
  // State Forms
  const [information, setInformation] = useState(
    participant.attend
      ? "Hadir"
      : participant.permission
      ? "Izin"
      : participant.sick
      ? "Sakit"
      : participant.absent
      ? "Tidak Hadir"
      : "Tidak Hadir"
  );
  const [isLoading, setIsLoading] = useState(false);

  // State Modal
  const [showEdit, setShowEdit] = useState(false);

  // Handler
  const handleInformation = (e) => setInformation(e.target.value);

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateDoc(doc(db, "attendance", data.id), {
        participants: arrayRemove(participant),
      }).then(async () => {
        const newParticipant = {
          ...participant,
          attend: information === "Hadir" ? 1 : 0,
          permission: information === "Izin" ? 1 : 0,
          sick: information === "Sakit" ? 1 : 0,
          absent: information === "Tidak Hadir" ? 1 : 0,
        };
        await updateDoc(doc(db, "attendance", data.id), {
          participants: arrayUnion(newParticipant),
        }).catch((err) => {
          console.log(err);
        });
      });
      Swal.fire("Success!", "Memperbarui berhasil!", "success");
      setIsLoading(false);
      setShowEdit(false);
      setInformation(
        participant.attend
          ? "Attend"
          : participant.permission
          ? "Permission"
          : participant.sick
          ? "Sick"
          : participant.absent
          ? "Absent"
          : "Absent"
      );
    } catch (err) {
      Swal.fire("Something Error!", "Ada sesuatu kesalahan!", "error");
      setIsLoading(false);
      console.log(err);
    }
  };

  // Clear State Modal on Hide
  const modalOnHide = () => {
    setShowEdit(false);
    setIsLoading(false);
    setInformation(
      participant.attend
        ? "Hadir"
        : participant.permission
        ? "Izin"
        : participant.sick
        ? "Sakit"
        : participant.absent
        ? "Tidak Hadir"
        : "Tidak Hadir"
    );
  };

  return (
    <>
      <Button className="btn-success" onClick={() => setShowEdit(true)}>
        Sunting
      </Button>

      <Modal size="xl" show={showEdit} onHide={() => modalOnHide()}>
        <Modal.Header closeButton>
          <Modal.Title>Perbarui Keterangan Absensi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="my-4">
            <Form.Label>NIS</Form.Label>
            <Form.Control type="text" value={participant.nis} disabled={true} />
          </Form.Group>
          <Form.Group className="my-4">
            <Form.Label>Nama</Form.Label>
            <Form.Control type="text" value={participant.name} disabled={true} />
          </Form.Group>
          <Form.Group className="my-4">
            <Form.Label>Kelas</Form.Label>
            <Form.Control type="text" value={participant.classroom} disabled={true} />
          </Form.Group>
          <Form.Select
            onChange={handleInformation}
            defaultValue={
              participant.attend
                ? "Hadir"
                : participant.permission
                ? "Izin"
                : participant.sick
                ? "Sakit"
                : participant.absent
                ? "Tidak Hadir"
                : "Tidak Hadir"
            }
          >
            <option value="Hadir">Hadir</option>
            <option value="Izin">Izin</option>
            <option value="Sakit">Sakit</option>
            <option value="Tidak Hadir">Tidak Hadir</option>
          </Form.Select>
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex mx-auto">
            <Button className="px-5 py-2" onClick={handleSubmit} disabled={isLoading || !information}>
              {isLoading ? `Loading...` : "Simpan"}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}
