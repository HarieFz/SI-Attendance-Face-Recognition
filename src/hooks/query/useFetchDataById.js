import Swal from "sweetalert2";
import { db } from "../../config/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

const useFetchDataById = (path, id) => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const fetch = useCallback(() => {
    const unsub = onSnapshot(
      doc(db, path, id),
      (doc) => {
        setData(doc.data());
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        console.log(error);
        Swal.fire("Something Error!", "Something Error!", "error");
      }
    );

    return unsub;
  }, [id, path]);

  useEffect(() => {
    setIsLoading(true);
    fetch();
  }, [fetch]);

  return { data, isLoading };
};

export default useFetchDataById;
