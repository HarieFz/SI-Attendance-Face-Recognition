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
import Webcam from "react-webcam";
import { drawRectAndLabelFace } from "../../utils/drawRectAndLabelFace";

export default function FaceRecognition() {
  // State Common
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceMatcher, setFaceMatcher] = useState([]);
  const [captureVideo, setCaptureVideo] = useState(false);

  const videoRef = useRef();
  const videoWidth = 400;
  const videoHeight = 350;
  const videoConstraints = {
    facingMode: "user",
  };
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

  // Handle Start Video
  const startVideo = async () => {
    setCaptureVideo(true);
    await navigator.mediaDevices
      .getUserMedia({ audio: false, video: true })
      .then((stream) => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.video.play();
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
    const interval = setInterval(async () => {
      if (canvasRef && canvasRef.current) {
        canvasRef.current.innerHTML = faceapi.createCanvas(videoRef.current);

        const displaySize = {
          width: videoWidth,
          height: videoHeight,
        };

        faceapi.matchDimensions(canvasRef.current, displaySize);

        let img = videoRef.current.getScreenshot() && (await faceapi.fetchImage(videoRef.current.getScreenshot()));

        const detections =
          img &&
          (await faceapi
            .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptors());

        // Clear previous dots
        const ctx = canvasRef && canvasRef.current && canvasRef.current.getContext("2d");
        ctx && ctx.clearRect(0, 0, videoWidth, videoHeight);

        const resizedDetections = detections && faceapi.resizeResults(detections, displaySize);

        const results = resizedDetections && resizedDetections.map((d) => faceMatcher.findBestMatch(d.descriptor));

        results &&
          results.forEach(async (result, i) => {
            const box = resizedDetections[i].detection.box;
            const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() });
            drawBox.draw(canvasRef.current);
          });

        // if (results) {
        //   results.map(async (result) => {
        //     if (result._label !== "unknown") {
        //       try {
        //         await addDoc(collection(db, "attendance"), {
        //           school_year: "Tahun Ajaran 2023/2024",
        //           course_name: "Pertemuan 1",
        //           date: moment().format("LL"),
        //           classroom: "IPA 2",
        //           participants: [{ name: result._label }],
        //           present: 1,
        //           on_leave: 0,
        //           absent: 0,
        //         });
        //         console.log("Success!", "Added attendance succesfully!", "success");
        //       } catch (err) {
        //         console.log("Something Error!", "Something Error!", "error");
        //         console.log(err);
        //       }
        //     }
        //   });
        // }
      }
    }, 700);

    return () => clearInterval(interval);
  };

  // Handle Close Webcam
  const closeWebcam = () => {
    videoRef.current.video.pause();
    videoRef.current?.srcObject?.getTracks()[0].stop();
    setCaptureVideo(false);
  };

  return (
    <>
      <div className="d-flex gap-4">
        {captureVideo && modelsLoaded ? (
          <Button onClick={closeWebcam}>Close Webcam</Button>
        ) : (
          <Button onClick={startVideo}>Open Webcam</Button>
        )}
      </div>

      {captureVideo ? (
        modelsLoaded ? (
          <div style={{ display: "flex" }}>
            <Webcam
              ref={videoRef}
              muted={true}
              audio={false}
              width={videoWidth}
              height={videoHeight}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              onPlay={handleVideoOnPlay}
              mirrored
            />
            <canvas ref={canvasRef} width={videoWidth} height={videoHeight} style={{ position: "absolute" }} />
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
