/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import * as faceapi from "face-api.js";
import useFetchAllData from "../../hooks/query/useFetchAllData";
import { createMatcher } from "../../faceUtil";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../config/firebase";
import moment from "moment/moment";
// import Webcam from "react-webcam";

export default function AttendanceRoom() {
  // State Common
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceMatcher, setFaceMatcher] = useState([]);
  const [captureVideo, setCaptureVideo] = useState(false);
  moment().locale("id");

  const videoRef = useRef();
  const videoHeight = 480;
  const videoWidth = 640;
  const canvasRef = useRef();

  const facePhotos = useFetchAllData("/students");
  const { data, isLoading } = facePhotos;

  // Load Models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + "/models";

      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]).then(setModelsLoaded(true));
    };
    loadModels();
  }, []);

  // Select Device
  // useEffect(() => {
  //   navigator.mediaDevices.enumerateDevices().then(async (devices) => {
  //     let videoDevices = await devices.filter((device) => device.kind === "videoinput");
  //     setVideoDevices({ ...videoDevices, videoDevices });
  //   });
  // }, []);

  // Handle Start Video
  const startVideo = async () => {
    setCaptureVideo(true);
    await navigator.mediaDevices
      .getUserMedia({ audio: false, video: true })
      .then((stream) => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.error("error:", err);
      });
  };

  useEffect(() => {
    async function matcher() {
      if (data && !isLoading) {
        const profileList = await createMatcher(data, 0.5);
        setFaceMatcher(profileList);
      }
    }
    if (data) {
      matcher();
    }
  }, [data]);

  // Handle when Video on Play
  const handleVideoOnPlay = () => {
    setInterval(async () => {
      if (canvasRef && canvasRef.current) {
        canvasRef.current.innerHTML = faceapi.createCanvas(videoRef.current);
        const displaySize = {
          width: videoWidth,
          height: videoHeight,
        };

        faceapi.matchDimensions(canvasRef.current, displaySize);

        const detections = await faceapi
          .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptors();

        // Clear previous dots
        canvasRef && canvasRef.current && canvasRef.current.getContext("2d").clearRect(0, 0, videoWidth, videoHeight);

        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        const results = resizedDetections.map((d) => faceMatcher.findBestMatch(d.descriptor));

        results.forEach(async (result, i) => {
          const box = resizedDetections[i].detection.box;
          faceapi.draw.drawDetections(canvasRef.current, resizedDetections[i]);
          const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString(), lineWidth: 2 });
          drawBox.draw(canvasRef.current);
        });

        if (results) {
          results.map(async (result) => {
            if (result._label !== "unknown") {
              try {
                await addDoc(collection(db, "attendance"), {
                  school_year: "Tahun Ajaran 2023/2024",
                  course_name: "Pertemuan 1",
                  date: moment().format("LL"),
                  classroom: "IPA 2",
                  participants: [{ name: result._label }],
                  present: 1,
                  on_leave: 0,
                  absent: 0,
                });
                console.log("Success!", "Added attendance succesfully!", "success");
              } catch (err) {
                console.log("Something Error!", "Something Error!", "error");
                console.log(err);
              }
            }
          });
        }
      }
    }, 1000);
  };

  // Handle Close Webcam
  const closeWebcam = () => {
    videoRef.current.pause();
    videoRef.current?.srcObject?.getTracks()[0].stop();
    setCaptureVideo(false);
  };

  return (
    <>
      <h3>Attendance Room</h3>

      <div className="d-flex gap-4">
        {/* <Form.Group className="mb-4">
          <Form.Label>Webcam</Form.Label>
          <Form.Select defaultValue={"Select Webcam"} onChange={handleSelectDevices}>
            <option>Select Webcam</option>
            {videoDevices?.videoDevices?.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label}
              </option>
            ))}
          </Form.Select>
        </Form.Group> */}

        {captureVideo && modelsLoaded ? (
          <Button style={{ height: "38.48px", marginTop: "31.98px" }} onClick={closeWebcam}>
            Close Webcam
          </Button>
        ) : (
          <Button style={{ height: "38.48px", marginTop: "31.98px" }} onClick={startVideo}>
            Open Webcam
          </Button>
        )}
      </div>

      {captureVideo ? (
        modelsLoaded ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "10px" }}>
            <video
              ref={videoRef}
              width={videoWidth}
              height={videoHeight}
              onPlay={handleVideoOnPlay}
              style={{ borderRadius: "10px" }}
            />
            <canvas ref={canvasRef} style={{ position: "absolute" }} />
          </div>
        ) : (
          <p>Loading...</p>
        )
      ) : (
        <></>
      )}
    </>
  );
}
