import * as faceapi from "face-api.js";

export async function createMatcher(faceStudents, maxDescriptorDistance) {
  const loadLabeledDescriptor = () => {
    const labeledDescriptors = faceStudents?.map((item) =>
      item?.participants?.map((e) => {
        const description = [new Float32Array(e?.faceDescriptor?.match(/-?\d+(?:\.\d+)?/g)?.map(Number))];

        return new faceapi.LabeledFaceDescriptors(e.name, description);
      })
    );

    return labeledDescriptors[0];
  };

  const labeledFaceDescriptors = await loadLabeledDescriptor();

  // Create face matcher (maximum descriptor distance is 0.5)
  if (labeledFaceDescriptors) {
    let faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, maxDescriptorDistance);
    return faceMatcher;
  }
}
