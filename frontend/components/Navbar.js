import React, { useState, useEffect } from "react";
import styles from "../styles/Navbar.module.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMediaQuery } from "@react-hook/media-query";
import { FaBars } from "react-icons/fa";

const Navbar = () => {
  const [iconToggle, setIconToggle] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const link = [
    { name: "Home", link: "/resepsionis/" },
    { name: "Transaction", link: "/resepsionis/transaction" },
    { name: "Booking", link: "/resepsionis/booking" },
  ];

  const router = useRouter();

  const handleLogOut = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    localStorage.removeItem("nama_user");
    router.push("/login");
  };
  const mediaQueries = {
    small: "(max-width: 600px)",
    medium: "(min-width: 600px) and (max-width: 1024px)",
    large: "(min-width: 1025px)",
  };

  const isSmall = useMediaQuery(mediaQueries.small);

  useEffect(() => {
    if (isSmall) {
      setIconToggle(true);
    } else {
      setIconToggle(false);
    }
  }, [isSmall]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className={styles.navbar_container}>
        <div className={styles.navbar_logo}>
          <Image
            src={"/logo_blue.png"}
            width={150}
            height={200}
            alt="cumanginep logo"
          />
        </div>
        <div className={styles.link_container}>
          {!iconToggle ? (
            <>
              {link.map((item, index) => (
                <Link key={index} href={item.link}>
                  {item.name}
                </Link>
              ))}
              <button onClick={handleLogOut} className={styles.logout}>
                Logout
              </button>
            </>
          ) : (
            <div className={styles.bars_icon}>
              <FaBars onClick={toggleMenu} />
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <div className={styles.sidebar_container}>
          {link.map((item, index) => (
          <Link key={index} href={item.link}>
            {item.name}
          </Link>
          ))}
          <button onClick={handleLogOut} className={styles.logout_sidebar}>
            Logout
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;
