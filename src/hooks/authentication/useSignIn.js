/* eslint-disable react-hooks/exhaustive-deps */
import Swal from "sweetalert2";
import { auth } from "../../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const useSignIn = (email, password, redirect, Auth) => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [payload, mutate] = useState(false);

  const login = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        Auth(user);
        Swal.fire({
          text: "Success!",
          title: "Login Successfully",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
        mutate(false);
        setIsLoading(false);
        navigate(redirect);
      })
      .catch((err) => {
        mutate(false);
        setIsLoading(false);
        console.error(err);
        if (err.code === "auth/user-not-found") {
          return Swal.fire("Something Error!", "User not found!", "error");
        }
        Swal.fire("Something Error!", "Please check again Email and Password", "error");
      });
  };

  useEffect(() => {
    if (payload) {
      setIsLoading(true);
      login();
    }
  }, [payload, email, password, redirect, Auth]);

  return { mutate, isLoading };
};

export default useSignIn;
