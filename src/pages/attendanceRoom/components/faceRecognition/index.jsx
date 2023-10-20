import React, { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import * as faceapi from "face-api.js";
import { createMatcher } from "../../../../faceUtil";
import Webcam from "react-webcam";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../config/firebase";

export default function FaceRecognition({ data, isLoading }) {
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
    const matcher = async () => {
      if (data.length !== 0) {
        const profileList = await createMatcher(data, 0.5);
        setFaceMatcher(profileList);
      }
    };
    if (data.length !== 0) {
      matcher();
    }
  }, [data, isLoading]);

  // Handle when Video on Play
  const handleVideoOnPlay = () => {
    const interval = setInterval(async () => {
      if (canvasRef && canvasRef.current && faceMatcher.length !== 0) {
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

        const results =
          resizedDetections && resizedDetections.map((d) => faceMatcher && faceMatcher.findBestMatch(d.descriptor));

        results &&
          results.forEach(async (result, i) => {
            const box = resizedDetections[i].detection.box;
            const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() });
            canvasRef.current && drawBox.draw(canvasRef.current);
          });

        if (results) {
          results.map(async (result) => {
            if (result._label !== "unknown") {
              data?.map(async (item) => {
                const participant = item?.participants?.find((item) => item.name === result._label);
                await updateDoc(doc(db, "attendance", item.id), {
                  participants: arrayRemove(participant),
                }).then(async () => {
                  const obj = { ...participant, attend: 1, absent: 0, permission: 0, sick: 0 };
                  await updateDoc(doc(db, "attendance", item.id), {
                    participants: arrayUnion(obj),
                  }).catch((err) => {
                    console.log(err);
                  });
                });
              });
            }
          });
        }
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
