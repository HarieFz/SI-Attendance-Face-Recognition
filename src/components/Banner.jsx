import React from "react";

export default function Banner({ content }) {
  return (
    <>
      <div className="mb-3 text-center rounded-3 hero__bg">
        <h3 className="fw-semibold banner__spacing" style={{ color: "#094B72" }}>
          {content}
        </h3>
      </div>
    </>
  );
}
