import React, { useCallback, useEffect, useRef, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { Button, Modal } from "react-bootstrap";
import { db, storage } from "../../../../config/firebase";
import { fileReader } from "../../../../utils/fileReader";
import * as faceapi from "face-api.js";
import FormAddStudent from "./FormAddStudent";
import Swal from "sweetalert2";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export default function ModalAddStudent({ show, setShow }) {
  // State Forms
  const fileInput = useRef();
  const [selectedPhoto, setSelectedPhoto] = useState();
  const [previewPhoto, setPreviewPhoto] = useState();
  const [nis, setNis] = useState("");
  const [name, setName] = useState("");
  const [classroom, setClassroom] = useState("");
  const [noPhone, setNoPhone] = useState(0);
  const [address, setAddress] = useState("");

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
  };

  // Input File Reader
  useEffect(() => {
    fileReader(setPreviewPhoto, selectedPhoto);
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
        setDetectionCount(data?.length);
        setFaceDescriptor(data[0]?.descriptor);
        setIsRunningFaceDetector(false);
      });
    }
  }, [detections, previewPhoto]);

  // Upload Photo to Storage
  const handlePhoto = async () => {
    if (!selectedPhoto) return;
    const path = `photos/${selectedPhoto?.name}`;
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, selectedPhoto);

    await uploadTask;

    let downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

    return downloadURL;
  };

  // Create Post
  const createPost = async (photoURL) => {
    if (faceDescriptor) {
      await addDoc(collection(db, "students"), {
        nis: nis,
        name: name,
        classroom: classroom,
        no_phone: noPhone,
        address: address,
        photo_URL: photoURL,
        faceDescriptor: faceDescriptor.toString(),
      });
    }
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const photoURL = await handlePhoto();
    createPost(photoURL)
      .then(() => {
        Swal.fire("Success!", "Added photo is successfully!", "success");
        setIsLoading(false);
        setSelectedPhoto();
        setPreviewPhoto();
        setNis("");
        setName("");
        setClassroom("");
        setNoPhone(0);
        setAddress("");
        setFaceDescriptor([]);
        setDetectionCount(0);
        setIsRunningFaceDetector(false);
        setShow(false);
      })
      .catch((err) => {
        Swal.fire("Something Error!", "Something Error!", "error");
        setIsLoading(false);
        console.log(err);
      });
  };

  // Clear State Modal on Hide
  const modalOnHide = () => {
    setShow(false);
    setIsLoading(false);
    setSelectedPhoto();
    setPreviewPhoto();
    setNis("");
    setName("");
    setClassroom("");
    setNoPhone(0);
    setAddress("");
    setFaceDescriptor([]);
    setDetectionCount(0);
    setIsRunningFaceDetector(false);
  };

  return (
    <Modal size="xl" show={show} onHide={() => modalOnHide()}>
      <Modal.Header closeButton>
        <Modal.Title>Add Student</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormAddStudent
          fileInput={fileInput}
          previewPhoto={previewPhoto}
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
          <Button
            className="px-5 py-2"
            onClick={handleSubmit}
            disabled={
              isLoading ||
              !previewPhoto ||
              !nis ||
              !name ||
              !classroom ||
              !noPhone ||
              !address ||
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
