import React, { useState } from "react";
import { Button } from "react-bootstrap";

export default function RecapAttend({ data, RenderComponent }) {
  // State

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (data) {
      data?.forEach((item) => {
        item?.participants?.forEach((e) => {
          if (e.absent === 1) {
            console.log(`Sent message to ${e.name}`);
            setIsLoading(false);
          }
        });
      });
    }
  };

  return (
    <div>
      {/* head */}
      <div className="d-flex justify-content-between px-4 pt-4">
        <h5>
          Students | <small style={{ fontSize: 15 }}>total {data?.length}</small>
        </h5>
      </div>
      <hr style={{ height: "5px", marginBottom: "0", border: "none", background: "#000000" }} />

      {/* Body */}
      <div>
        <RenderComponent data={data} />
      </div>

      {/* Footer */}
      <div className="d-flex justify-content-end px-4 pb-4">
        <Button onClick={handleSubmit} disabled={isLoading}>
          Send SMS for Parent
        </Button>
      </div>
    </div>
  );
}
