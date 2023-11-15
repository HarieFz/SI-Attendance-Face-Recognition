import React from "react";

export default function Banner(props) {
  return (
    <>
      <div className="mb-3 text-center rounded-3 hero__bg">
        <h3
          className="fw-semibold banner__spacing"
          style={{ color: "#094B72" }}
        >
          {props.children}
        </h3>
      </div>
    </>
  );
}
