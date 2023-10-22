import React, { useState, useEffect } from "react";
import styles from "../styles/Hero.module.css";
import Image from "next/image";

const Hero = () => {
  const [nama, setNama] = useState("");

  useEffect(() => {
    setNama(window.localStorage.getItem("nama_user"));
  }, []);

  return (
    <div className={styles.hero_container}>
      <div className={styles.hero_image_container}>
        <Image
          src={"/hero_illus.svg"}
          width={500}
          height={500}
          alt="hero illustration"
        />
      </div>
      <div className={styles.hero_text_container}>
        <p>hallo {nama} 👋🏻</p>
        <h4 className={styles.hero_text_desk}>Sambut tamu dengan keramahan dan layanan istimewa yang akan menghadirkan pengalaman tak terlupakan!</h4>
      </div>
    </div>
  );
};

export default Hero;
