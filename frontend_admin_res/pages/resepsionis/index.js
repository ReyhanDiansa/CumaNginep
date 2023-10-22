import React, { useEffect,useState } from "react";
import withAuth from "../withAuth";
import Navbar from "../../components/Navbar";
import styles from "../../styles/HomeRes.module.css";
import Image from "next/image";
import Hero from "../../components/Hero";

const index = () => {
  return (
    <>
      <div>
        <Navbar />
      </div>
      <Hero/>
    </>
  );
};

export default withAuth(index);
