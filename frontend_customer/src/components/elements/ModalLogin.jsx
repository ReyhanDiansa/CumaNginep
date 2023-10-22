import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/router";
import SpinnerLoading from "../elements/SpinnerLoading";
import Modal from "./Modal";
import { UserLogin } from "../../utils/LoginGoogle";
import jwt from "jsonwebtoken";
import axios from "axios";

const googleLogin = () => {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const isSuccess = async (credentialResponse) => {
    setIsLoading(true);
    
    // console.log(userData, "mkm");
    try {
      await UserLogin(credentialResponse.credential);
      setTimeout(() => {
        setIsLoading(false);
        // router.push("/");
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };
  const isFailed = () => {
    setIsError(true);
  };

  return (
    <>
      {isLoading && <SpinnerLoading />}
      <div className="flex mx-auto justify-center w-full">
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENTID}>
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              isSuccess(credentialResponse);
            }}
            onError={isFailed}
            useOneTap
            className="mx-auto flex justify-center"
          />
        </GoogleOAuthProvider>
      </div>
      {isError && (
        <div className="mx-auto flex justify-center py-3 text-sm text-red-600">
          <p>Login Failed</p>
        </div>
      )}
    </>
  );
};

const ModalLogin = ({ isOpen, closeModal }) => {
  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <div className="my-3">
        <p className="font-semibold text-2xl">Welcome to CumaNginep</p>
        <p className="font-light text-center text-xs">
          Please log in to make a reservation
        </p>
        <div className="w-full my-5">{googleLogin()}</div>
      </div>
    </Modal>
  );
};

export default ModalLogin;
