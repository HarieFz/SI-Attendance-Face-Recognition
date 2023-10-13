import * as faceapi from "face-api.js";

// Load Models
export async function loadModels() {
  const MODEL_URL = process.env.PUBLIC_URL + "/models";
  try {
    await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
    await faceapi.loadTinyFaceDetectorModel(MODEL_URL);
    await faceapi.loadFaceLandmarkTinyModel(MODEL_URL);
    await faceapi.loadFaceRecognitionModel(MODEL_URL);
  } catch (err) {
    console.log(err);
  }
}

// Get Full Face Description
export async function getFullFaceDescription(blob, inputSize = 512) {
  let scoreThreshold = 0.8;
  const OPTION = new faceapi.SsdMobilenetv1Options({
    inputSize,
    scoreThreshold,
  });
  const useTinyModel = true;
  const img = await faceapi.fetchImage(blob);
  const detections = await faceapi.detectAllFaces(img, OPTION).withFaceLandmarks(useTinyModel).withFaceDescriptors();
  return detections;
}

export async function createMatcher(faceStudents, maxDescriptorDistance) {
  const loadLabeledDescriptor = () => {
    const labeledDescriptors = faceStudents?.map((item) => {
      const description = [new Float32Array(item?.faceDescriptor?.match(/-?\d+(?:\.\d+)?/g)?.map(Number))];

      return new faceapi.LabeledFaceDescriptors(item.name, description);
    });

    return labeledDescriptors;
  };

  const labeledFaceDescriptors = await loadLabeledDescriptor();

  // Create face matcher (maximum descriptor distance is 0.5)
  if (labeledFaceDescriptors.length > 0) {
    let faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, maxDescriptorDistance);
    return faceMatcher;
  }
}
