import React, { useCallback, useEffect, useRef, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { Button, Modal } from "react-bootstrap";
import { db, storage } from "../../../../config/firebase";
import { fileReader } from "../../../../utils/fileReader";
import * as faceapi from "face-api.js";
import Swal from "sweetalert2";
import FormEditStudent from "./FormEditStudent";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export default function ModalEditStudent({ data }) {
  // State Forms
  const fileInput = useRef();
  const [selectedPhoto, setSelectedPhoto] = useState();
  const [previewPhoto, setPreviewPhoto] = useState();
  const [nis, setNis] = useState("");
  const [name, setName] = useState("");
  const [classroom, setClassroom] = useState("");
  const [noPhone, setNoPhone] = useState(0);
  const [address, setAddress] = useState("");
  const [show, setShow] = useState(false);

  console.log(address);

  useEffect(() => {
    setSelectedPhoto(data.photo_URL);
    setNis(data.nis);
    setName(data.name);
    setClassroom(data.classroom);
    setNoPhone(data.no_phone);
    setAddress(data.address);
  }, [data]);

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
    setSelectedPhoto();
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

    if (previewPhoto) {
      const img = await faceapi.fetchImage(previewPhoto);
      const descriptions = await faceapi
        .detectAllFaces(img, OPTION)
        .withFaceLandmarks(useTinyModel)
        .withFaceDescriptors();
      return descriptions;
    }
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
      try {
        await updateDoc(doc(db, "students", data.id), {
          nis: nis,
          name: name,
          classroom: classroom,
          no_phone: noPhone,
          address: address,
          photo_URL: isFile(selectedPhoto) ? photoURL : selectedPhoto,
          faceDescriptor: data?.faceDescriptor ? data?.faceDescriptor : faceDescriptor.toString(),
        });
        Swal.fire("Success!", "Updated photo is successfully!", "success");
        setIsLoading(false);
        setSelectedPhoto(data.photo_URL);
        setPreviewPhoto();
        setNis(data.nis);
        setName(data.name);
        setClassroom(data.classroom);
        setNoPhone(data.no_phone);
        setAddress(data.address);
        setFaceDescriptor([]);
        setDetectionCount(0);
        setIsRunningFaceDetector(false);
        setShow(false);
      } catch (err) {
        Swal.fire("Something Error!", "Something Error!", "error");
        setIsLoading(false);
        console.log(err);
      }
    }
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const photoURL = await handlePhoto();
    createPost(photoURL);
  };

  // Clear State Modal on Hide
  const modalOnHide = () => {
    setShow(false);
    setIsLoading(false);
    setSelectedPhoto(data.photo_URL);
    setPreviewPhoto();
    setNis(data.nis);
    setName(data.name);
    setClassroom(data.classroom);
    setNoPhone(data.no_phone);
    setAddress(data.address);
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
    <>
      <Button className="btn-success" onClick={() => setShow(true)}>
        Edit
      </Button>

      <Modal size="xl" show={show} onHide={modalOnHide}>
        <Modal.Header closeButton>
          <Modal.Title>Add Student</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ zIndex: "0" }}>
          <FormEditStudent
            fileInput={fileInput}
            photo={selectedPhoto}
            previewPhoto={previewPhoto}
            id={data.id}
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
    </>
  );
}
