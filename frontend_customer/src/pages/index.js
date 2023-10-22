import LandingPage from "../components/pages/LandingPage";
import { getTokenCookie } from "../utils/HandleCookie";
import Image from "next/image";
import React, {useState, useEffect} from "react";
import jwt from "jsonwebtoken";


export default function Home() {

  return (
    <div>
      <LandingPage />
     
    </div>
  )
}
