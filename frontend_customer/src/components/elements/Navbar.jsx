import React, { useState, useEffect } from "react";
import Image from "next/image";
import ModalLogin from "./ModalLogin";
import { getTokenCookie, removeTokenCookie } from "../../utils/HandleCookie";
import jwt from "jsonwebtoken";
import { CiLogout } from "react-icons/ci";
import { useRouter } from "next/router";
import Link from "next/link";
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [isOpen, setisOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [token, setToken] = useState("");
  const [userData, setUserData] = useState("");
  const router = useRouter();
  const pathname = router.asPath;
  // console.log(userData);
  useEffect(() => {
    setToken(getTokenCookie());
    if (token) {
      const data = jwt.decode(token);
      setUserData({
        email: data.email,
        googleId: data.sub,
        name: data.name,
        profile: data.picture,
      });
    }
  }, [token]);

  const handleLogOut = () => {
    try {
      removeTokenCookie();
      // router.push("/");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const [scrollPosition, setScrollPosition] = useState(0);
  const [isScroll, setIsScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Get the current scroll position
      const currentPosition = window.scrollY;
      // console.log(currentPosition);
      setScrollPosition(currentPosition);
    };

    // Attach the event listener when the component mounts
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (scrollPosition > 458) {
      setIsScroll(true);
    } else if (scrollPosition < 458) {
      setIsScroll(false);
    }
  }, [scrollPosition]);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setMobile(true);
    } else {
      setMobile(false);
    }
  }, []);

  const handleClick = () => {
    setisOpen(!isOpen);
  };

  return (
    <>
      <div
        className={`flex justify-between px-4 py-2 w-full fixed z-50 ${
          pathname !== "/" ? "bg-[#024f79]" : isScroll ? "bg-[#024f79]" : ""
        }`}
        id="nav"
      >
        <div>
          <Image
            src="/images/logo/logo_white.png"
            width={150}
            height={150}
            alt="logo"
          />
        </div>
        {!mobile ? (
          <div className="flex items-center gap-10">
            <div>
              <Link href={"/"}>
                <span className="text-white font-semibold">Beranda</span>
              </Link>
            </div>
            <div>
              <Link href={"/Riwayat"}>
                <span className="text-white font-semibold">Riwayat</span>
              </Link>
            </div>

            {userData ? (
              <Image
                src={userData.profile}
                width={50}
                height={50}
                alt="profile"
                className="rounded-full bg-white p-1 cursor-pointer"
                onClick={() => setOpenDropdown(!openDropdown)}
              />
            ) : (
              <button
                className="bg-[#024f79] text-white px-10 py-2 rounded-3xl border-white border-[1px]"
                onClick={openModal}
              >
                Login
              </button>
            )}
          </div>
        ) : (
          <div onClick={handleClick} className="mx-2 mt-5 text-lg text-white">
            {isOpen ? <AiOutlineClose /> : <FaBars />}
          </div>
        )}
        {isOpen && (
          <div
            className={` flex flex-col border-2 items-center justify-center fixed right-0 top-14 h-[13rem] rounded w-56 bg-white transform ${
              isOpen ? "open_sidebar" : "close_sidebar"
            }`}
          >
            <div >
              <div>
                <Link href={"/"}>
                  <span className="text-black font-semibold">Beranda</span>
                </Link>
              </div>
              <div className="my-10">
                <Link href={"/Riwayat"}>
                  <span className="text-black font-semibold">Riwayat</span>
                </Link>
              </div>

              {userData ? (
                <Image
                  src={userData.profile}
                  width={50}
                  height={50}
                  alt="profile"
                  className="rounded-full bg-white p-1 cursor-pointer"
                  onClick={() => setOpenDropdown(!openDropdown)}
                />
              ) : (
                <button
                  className="bg-[#024f79] text-white px-10 py-2 rounded-3xl border-white border-[1px]"
                  onClick={openModal}
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
        <ModalLogin isOpen={isModalOpen} closeModal={closeModal} />
        {openDropdown && (
          <div className={` w-[10rem] ${mobile ? 'top-64':'top-20'}  z-10 fixed border-2 border-gray-300 text-black right-6 bg-white p-2 rounded-b-md rounded-tl-md `}>
            <div className="py-3  border-b-2 border-black">
              <h1 className="font-semibold">{userData.name}</h1>
              <p className="text-gray-500 break-words text-xs ">
                {userData.email}
              </p>
            </div>
            <div
              className="flex py-3 gap-1 items-center justify-center hover:bg-slate-200 cursor-pointer my-2 hover:rounded-2xl"
              onClick={handleLogOut}
            >
              <CiLogout className="text-2xl" />
              <p>Logout</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
