import React, { useState } from "react";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";

export default function RecapAttend({ data, RenderComponent }) {
  // State
  const [isLoading, setIsLoading] = useState(false);

  console.log(data);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (data) {
      data?.forEach((item) => {
        item?.participants?.forEach((e) => {
          if (e.absent === 1) {
            fetch("http://localhost:3001/api/messages", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                to: `${e.no_phone}`,
                body: `Assalamu'alaikum Wr. Wb.
                      Pemberitahuan siswa dengan nama ${e?.name} tidak 
                      mengikuti kelas (Alpa) pada tanggal ${item?.date}}.
                      Terima kasih atas perhatiannya.
                      Wassalamu'alaikum Wr. Wb.`,
              }),
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.success) {
                  Swal.fire("Berhasil!", "Berhasil mengirim SMS ke Orang Tua Siswa!", "success");
                  setIsLoading(false);
                } else {
                  Swal.fire("Error!", "Telah terjadi sesuatu kesalahan!", "error");
                  setIsLoading(false);
                }
              })
              .catch((err) => {
                console.log(err);
                Swal.fire("Error!", "Telah terjadi sesuatu kesalahan!", "error");
                setIsLoading(false);
              });
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
          Siswa | <small style={{ fontSize: 15 }}>total {data?.length}</small>
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
          Kirim SMS ke Orang tua Siswa
        </Button>
      </div>
    </div>
  );
}
