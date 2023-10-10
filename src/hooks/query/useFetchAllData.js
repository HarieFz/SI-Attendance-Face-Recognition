/* eslint-disable react-hooks/exhaustive-deps */
import Swal from "sweetalert2";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useEffect, useState } from "react";

const useFetchAllData = (path) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetch = () => {
    const q = query(collection(db, path));
    const unsub = onSnapshot(
      q,
      (querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });
        setData(data);
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        console.log(error);
        Swal.fire("Something Error!", "Something Error!", "error");
      }
    );

    return unsub;
  };

  useEffect(() => {
    setIsLoading(true);
    fetch();
  }, [path]);

  return { data, isLoading };
};

export default useFetchAllData;
