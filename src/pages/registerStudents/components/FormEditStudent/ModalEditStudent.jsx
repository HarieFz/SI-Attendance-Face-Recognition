import React, { useCallback, useEffect, useRef, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { Button, Modal } from "react-bootstrap";
import { db } from "../../../../config/firebase";
import { fileReader } from "../../../../utils/fileReader";
import * as faceapi from "face-api.js";
import Swal from "sweetalert2";
import FormEditStudent from "./FormEditStudent";

export default function ModalEditStudent({ show, setShow, data }) {
  // Data from Firestore
  const { id, data: student } = data;

  // State Forms
  const fileInput = useRef();
  const [selectedPhoto, setSelectedPhoto] = useState(student.photo_URL);
  const [previewPhoto, setPreviewPhoto] = useState();
  const [nis, setNis] = useState(student.nis);
  const [name, setName] = useState(student.name);
  const [classroom, setClassroom] = useState(student.classroom);
  const [noPhone, setNoPhone] = useState(student.no_phone);
  const [address, setAddress] = useState(student.address);

  // State Detect Face
  const [faceDescriptor, setFaceDescriptor] = useState([]);
  const [detectionCount, setDetectionCount] = useState(0);
  const [isRunningFaceDetector, setIsRunningFaceDetector] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // handler
  const handleSelectedPhoto = (e) => setSelectedPhoto(e.target.files[0]);
  const handleNis = (e) => setNis(e.target.value);
  const handleName = (e) => setName(e.target.value);
  const handleClassroom = (e) => setClassroom(e.target.value);
  const handleNoPhone = (e) => setNoPhone(e.target.value);
  const handleAddress = (e) => setAddress(e.target.value);

  // Custome Input File Photo
  const handleClick = () => {
    fileInput.current.click();
    setFaceDescriptor([]);
    setDetectionCount(0);
    setIsRunningFaceDetector(false);
  };

  // Is File
  const isFile = (input) => "File" in window && input instanceof File;

  // Input File Reader
  useEffect(() => {
    if (isFile(selectedPhoto)) {
      fileReader(setPreviewPhoto, selectedPhoto);
    }
  }, [selectedPhoto]);

  // Load Models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + "/models";

      Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);
    };
    loadModels();
  }, []);

  // Detections Image
  const detections = useCallback(async () => {
    let scoreThreshold = 0.8;
    const inputSize = 160;
    const OPTION = new faceapi.SsdMobilenetv1Options({
      inputSize,
      scoreThreshold,
    });
    const useTinyModel = true;
    const img = await faceapi.fetchImage(previewPhoto);
    const descriptions = await faceapi
      .detectAllFaces(img, OPTION)
      .withFaceLandmarks(useTinyModel)
      .withFaceDescriptors();
    return descriptions;
  }, [previewPhoto]);

  // Running Detect Face
  useEffect(() => {
    if (previewPhoto) {
      setIsRunningFaceDetector(true);
      detections().then((data) => {
        console.log(data);
        setDetectionCount(data?.length);
        setFaceDescriptor(data[0]?.descriptor);
        setIsRunningFaceDetector(false);
      });
    }
  }, [detections, previewPhoto]);

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (faceDescriptor) {
      try {
        await addDoc(collection(db, "students"), {
          nis: nis,
          name: name,
          classroom: classroom,
          no_phone: noPhone,
          address: address,
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

  // Clear State Modal on Hide
  const modalOnHide = () => {
    setShow(false);
    setIsLoading(false);
    setSelectedPhoto(student.photo_URL);
    setPreviewPhoto();
    setNis(student.nis);
    setName(student.name);
    setClassroom(student.classroom);
    setNoPhone(student.no_phone);
    setAddress(student.address);
    setFaceDescriptor([]);
    setDetectionCount(0);
    setIsRunningFaceDetector(false);
  };

  // Condition Disabled Button
  const disabled = () => {
    if (isFile(selectedPhoto))
      return (
        isLoading ||
        !selectedPhoto ||
        !previewPhoto ||
        !nis ||
        !name ||
        !classroom ||
        !noPhone ||
        !address ||
        !faceDescriptor ||
        !detectionCount ||
        detectionCount > 1
      );
    else return isLoading || !selectedPhoto || !nis || !name || !classroom || !noPhone || !address;
  };

  return (
    <Modal size="xl" show={show} onHide={() => modalOnHide()}>
      <Modal.Header closeButton>
        <Modal.Title>Add Student</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ zIndex: "0" }}>
        <FormEditStudent
          fileInput={fileInput}
          photo={selectedPhoto}
          previewPhoto={previewPhoto}
          id={id}
          nis={nis}
          name={name}
          classroom={classroom}
          noPhone={noPhone}
          address={address}
          isRunningFaceDetector={isRunningFaceDetector}
          detectionCount={detectionCount}
          handleSelectedPhoto={handleSelectedPhoto}
          handleClick={handleClick}
          handleNis={handleNis}
          handleName={handleName}
          handleClassroom={handleClassroom}
          handleNoPhone={handleNoPhone}
          handleAddress={handleAddress}
        />
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex mx-auto">
          <Button className="px-5 py-2" onClick={handleSubmit} disabled={disabled()}>
            {isLoading ? `Loading...` : "Save"}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
