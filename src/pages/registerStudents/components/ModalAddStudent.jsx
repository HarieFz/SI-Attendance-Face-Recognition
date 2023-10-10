import React, { useEffect, useRef, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { Button, Modal } from "react-bootstrap";
import { db } from "../../../config/firebase";
import { fileReader } from "../../../utils/fileReader";
import { getFullFaceDescription, loadModels } from "../../../faceUtil";
import { v4 as uuidv4 } from "uuid";
import * as faceapi from "face-api.js";
import FormAddStudent from "./FormAddStudent";
import Swal from "sweetalert2";

export default function ModalAddStudent({ show, setShow }) {
  // State Forms
  const fileInput = useRef();
  const [selectedPhoto, setSelectedPhoto] = useState();
  const [previewPhoto, setPreviewPhoto] = useState();
  const [name, setName] = useState("");
  const [classroom, setClassroom] = useState("");

  // State Detect Face
  const [faceDescriptor, setFaceDescriptor] = useState([]);
  const [detectionCount, setDetectionCount] = useState(0);
  const [isAllModelLoaded, setIsAllModelLoaded] = useState(false);
  const [isRunningFaceDetector, setIsRunningFaceDetector] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // handler
  const handleSelectedPhoto = (e) => setSelectedPhoto(e.target.files[0]);
  const handleName = (e) => setName(e.target.value);
  const handleClassroom = (e) => setClassroom(e.target.value);

  // Custome Input File Photo
  const handleClick = () => {
    fileInput.current.click();
  };

  // Input File Reader
  useEffect(() => {
    fileReader(setPreviewPhoto, selectedPhoto);
  }, [selectedPhoto]);

  // Load Models
  useEffect(() => {
    async function loadingTheModels() {
      await loadModels();
      setIsAllModelLoaded(true);
    }

    if (
      !!faceapi.nets.ssdMobilenetv1.params &&
      !!faceapi.nets.faceRecognitionNet.params &&
      !!faceapi.nets.faceLandmark68TinyNet.params
    ) {
      setIsAllModelLoaded(true);
      return;
    }
    loadingTheModels();
  }, [isAllModelLoaded]);

  // Running Detect Face
  useEffect(() => {
    if (previewPhoto) {
      setIsRunningFaceDetector(true);
      getFullFaceDescription(previewPhoto, 512).then((data) => {
        setDetectionCount(data?.length);
        setFaceDescriptor(data[0]?.descriptor);
        setIsRunningFaceDetector(false);
      });
    }
  }, [previewPhoto]);

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (faceDescriptor) {
      try {
        await addDoc(collection(db, "students"), {
          id: uuidv4(),
          name: name,
          classroom: classroom,
          faceDescriptor: faceDescriptor.toString(),
        });
        Swal.fire("Success!", "Added photo is successfully!", "success");
        setIsLoading(false);
      } catch (err) {
        Swal.fire("Something Error!", "Something Error!", "error");
        setIsLoading(false);
        console.log(err);
      }
    }
  };
  return (
    <Modal size="xl" show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Add Student</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ zIndex: "0" }}>
        <FormAddStudent
          fileInput={fileInput}
          previewPhoto={previewPhoto}
          name={name}
          classroom={classroom}
          detectionCount={detectionCount}
          isRunningFaceDetector={isRunningFaceDetector}
          handleSelectedPhoto={handleSelectedPhoto}
          handleName={handleName}
          handleClassroom={handleClassroom}
          handleClick={handleClick}
        />
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex mx-auto">
          <Button
            className="px-5 py-2"
            onClick={handleSubmit}
            disabled={
              isLoading ||
              !previewPhoto ||
              !name ||
              !classroom ||
              !faceDescriptor ||
              !detectionCount ||
              detectionCount > 1
            }
          >
            {isLoading ? `Loading...` : "Save"}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
