export const drawRectAndLabelFace = (descriptions, faceDB, participants, ctx) => {
  // Loop through each desc
  descriptions &&
    descriptions.forEach((desc) => {
      // Extract boxes and classes
      const { x, y, width, height } = desc.detection.box;
      const bestMatch = faceDB.findBestMatch(desc.descriptor);

      // Set styling
      if (bestMatch._label !== "unknown") {
        let filterParticipants = participants.filter((participant) => participant?.name === bestMatch?._label);
        bestMatch._label = filterParticipants[0]?.name;
      }

      ctx.beginPath();
      ctx.font = "normal 18px Gotham, Helvetica Neue, sans-serif";
      ctx.lineWidth = 2;
      ctx.strokeStyle = bestMatch._label === "unknown" ? "#E00" : "#0E0";

      console.log(ctx);

      // Draw rectangles and text
      ctx.fillStyle = bestMatch._label === "unknown" ? "#E00" : "#0E0";
      ctx.rect(x, y, width, height);

      ctx.fillText(bestMatch._label, x, y + height + 20);
      ctx.fillText(`L2: ${bestMatch.distance.toFixed(2)}`, x, y);

      ctx.stroke();
    });
};
