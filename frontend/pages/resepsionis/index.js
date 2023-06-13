import React, { useEffect,useState } from "react";
import withAuth from "../withAuth";
import Navbar from "../../components/Navbar";
import styles from "../../styles/HomeRes.module.css";

const index = () => {
  const [nama,setNama]=useState("")
  
  useEffect(()=>{
    setNama(window.localStorage.getItem("nama_user"))
  },[])

  return (
    <>
      <div>
        <Navbar />
      </div>
      <div className={styles.welcome}>
        <h1>Selamat Datang Kembali {nama}</h1>
        <h3>Semangat kerjanya!!!</h3>
      </div>
        <div className={styles.video_container}>
        <video    
            muted
            autoPlay
            loop
            playsInline
          >
            <source src={"/profil.mp4"} type="video/mp4"/>
          </video>
        </div>
    </>
  );
};

export default withAuth(index);
