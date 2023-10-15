import * as faceapi from "face-api.js";

export async function createMatcher(faceStudents, maxDescriptorDistance) {
  const loadLabeledDescriptor = () => {
    const labeledDescriptors = faceStudents?.map((item) => {
      const { data } = item;
      const description = [new Float32Array(data?.faceDescriptor?.match(/-?\d+(?:\.\d+)?/g)?.map(Number))];

      return new faceapi.LabeledFaceDescriptors(data.name, description);
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
