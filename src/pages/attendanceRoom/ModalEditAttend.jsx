import React, { useState } from "react";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { Button, Form, Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { db } from "../../config/firebase";

export default function ModalEditAttend({ data, participant, showEdit, setShowEdit }) {
  // State Forms
  const [information, setInformation] = useState(
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
  const [isLoading, setIsLoading] = useState(false);

  // handler
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
          attend: information === "Attend" ? 1 : 0,
          permission: information === "Permission" ? 1 : 0,
          sick: information === "Sick" ? 1 : 0,
          absent: information === "Absent" ? 1 : 0,
        };
        await updateDoc(doc(db, "attendance", data.id), {
          participants: arrayUnion(newParticipant),
        }).catch((err) => {
          console.log(err);
        });
      });
      Swal.fire("Success!", "Updated Attendance is successfully!", "success");
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
      Swal.fire("Something Error!", "Something Error!", "error");
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
        ? "Attend"
        : participant.permission
        ? "Permission"
        : participant.sick
        ? "Sick"
        : participant.absent
        ? "Absent"
        : "Absent"
    );
  };

  return (
    <Modal size="xl" show={showEdit} onHide={() => modalOnHide()}>
      <Modal.Header closeButton>
        <Modal.Title>Update Information Attendance</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="my-4">
          <Form.Label>NIS</Form.Label>
          <Form.Control type="text" value={participant.nis} disabled={true} />
        </Form.Group>
        <Form.Group className="my-4">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" value={participant.name} disabled={true} />
        </Form.Group>
        <Form.Group className="my-4">
          <Form.Label>Classroom</Form.Label>
          <Form.Control type="text" value={participant.classroom} disabled={true} />
        </Form.Group>
        <Form.Select
          onChange={handleInformation}
          defaultValue={
            participant.attend
              ? "Attend"
              : participant.permission
              ? "Permission"
              : participant.sick
              ? "Sick"
              : participant.absent
              ? "Absent"
              : "Absent"
          }
        >
          <option value="Attend">Attend</option>
          <option value="Permission">Permission</option>
          <option value="Sick">Sick</option>
          <option value="Absent">Absent</option>
        </Form.Select>
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex mx-auto">
          <Button className="px-5 py-2" onClick={handleSubmit} disabled={isLoading || !information}>
            {isLoading ? `Loading...` : "Save"}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
