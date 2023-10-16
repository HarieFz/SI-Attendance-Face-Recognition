import Swal from "sweetalert2";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useCallback, useEffect, useState } from "react";

const useFetchAllData = (path) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetch = useCallback(() => {
    const q = query(collection(db, path));
    const unsub = onSnapshot(
      q,
      (querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
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
  }, [path]);

  useEffect(() => {
    setIsLoading(true);
    fetch();
  }, [fetch]);

  return { data, isLoading };
};

export default useFetchAllData;
