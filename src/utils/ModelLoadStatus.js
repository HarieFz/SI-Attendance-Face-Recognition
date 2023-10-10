import React from "react";
import { Card } from "react-bootstrap";
import {
  isFaceDetectionModelLoaded,
  isFeatureExtractionModelLoaded,
  isFacialLandmarkDetectionModelLoaded,
} from "../faceUtil";

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ errorMessage }) => (
  <Card style={{ opacity: 0.8 }}>
    <p>
      Face Detector:{" "}
      {isFaceDetectionModelLoaded() ? (
        <strong>Loaded</strong>
      ) : errorMessage && errorMessage.length > 0 ? (
        <span style={{ color: "red", fontWeight: "bold" }}>ERROR</span>
      ) : (
        <>
          <strong>Loading</strong>
        </>
      )}
    </p>
    <p>
      Facial Landmark Detector:{" "}
      {isFacialLandmarkDetectionModelLoaded() ? (
        <strong>Loaded</strong>
      ) : errorMessage && errorMessage.length > 0 ? (
        <span style={{ color: "red", fontWeight: "bold" }}>ERROR</span>
      ) : (
        <>
          <strong>Loading</strong>
        </>
      )}
    </p>
    <p>
      Feature Extractor:{" "}
      {isFeatureExtractionModelLoaded() ? (
        <strong>Loaded</strong>
      ) : errorMessage && errorMessage.length > 0 ? (
        <span style={{ color: "red", fontWeight: "bold" }}>ERROR</span>
      ) : (
        <>
          <strong>Loading</strong>
        </>
      )}
    </p>
  </Card>
);
