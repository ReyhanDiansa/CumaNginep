import React, { forwardRef, useState, useEffect } from "react";
import Image from "next/image";
import DatePicker from "react-datepicker";
import moment from "moment";
import { CiCalendar, CiSearch, CiWarning } from "react-icons/ci";
import { TbMinusVertical } from "react-icons/tb";
import Navbar from "../elements/Navbar";
import TypeCard from "../elements/TypeCard";
import axios from "axios";
import SpinnerLoading from "../elements/SpinnerLoading";
import Footer from "../elements/Footer";

const LandingPage = () => {
  const [startDateIn, setStartDateIn] = useState(new Date());
  const [startDateOut, setStartDateOut] = useState(new Date());
  const [checkIn, setCheckIn] = useState();
  const [checkOut, setCheckOut] = useState();
  const [available, setAvailable] = useState([]);
  const [availableRooms, setAvailableRooms] = useState();
  const [showList, setShowList] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCheckIn(moment(startDateIn).format("YYYY-MM-DD"));
    setCheckOut(moment(startDateOut).format("YYYY-MM-DD"));
  }, [startDateIn, startDateOut]);

  // console.log(formattedDate, "mkmk");
  const handleChangeCheckIn = (e) => {
    setCheckIn(moment(e.target.value).format("YYYY-MM-DD"));
    setStartDateIn(e.target.value);
  };

  const handleChangeCheckOut = (e) => {
    setCheckOut(moment(e.target.value).format("YYYY-MM-DD"));
    setStartDateOut(e.target.value);
  };

  const handleCari = async () => {
    setLoading(true);
    try {
      const data = {
        check_in: checkIn,
        check_out: checkOut,
      };
      const checkAvailable = await axios.post(
        "http://localhost:8000/tipe/getAvailableTypeRoom",
        data
      );
      console.log(checkAvailable, "lkllk");
      if (
        checkAvailable.data.data === "nothing type room available" ||
        checkAvailable.data.data === "invalid date"
      ) {
        setShowError(true);
        setErrorMessage(checkAvailable.data.data);
        setShowList(false);
        setTimeout(() => {
          setLoading(false);
        }, 3000);
      } else if (checkIn === checkOut) {
        setShowError(true);
        setErrorMessage(
          "Tanggal check in tidak boleh sama dengan tanggal check out "
        );
        setShowList(false);
        setTimeout(() => {
          setLoading(false);
        }, 3000);
      } else {
        setShowError(false);
        setAvailable(checkAvailable.data.data);
        setShowList(true);
        setTimeout(() => {
          setLoading(false);
        }, 3000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAvailableRoom = async (type) => {
    try {
      const data = {
        nama_tipe: type,
        check_in: checkIn,
        check_out: checkOut,
      };

      const checkAvailableRoom = await axios.post(
        "http://localhost:8000/kamar/getAvailableWType",
        data
      );
      // console.log(checkAvailableRoom, "lklk");

      return checkAvailableRoom.data.sisa_kamar;
    } catch (error) {
      console.error("Error fetching available rooms: ", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchAvailableRooms = async () => {
      const rooms = await Promise.all(
        available.map(async (item) => {
          const availableRoom = await getAvailableRoom(item.nama_tipe_kamar);
          return { ...item, available: availableRoom };
        })
      );

      setAvailableRooms(rooms);
    };
    if (available) {
      fetchAvailableRooms();
    }
  }, [available]);

  return (
    <>
      <div className="bg-cover bg-center h-[60vh] md:h-[80vh] relative z-2">
        {/* Background Image */}
        <Image
          src="/images/lp_hotel.jpg"
          alt="Background Image"
          layout="fill"
          objectFit="cover"
        />

        {/* Content */}
        <div className="absolute top-0 w-full">
          <Navbar />
        </div>
        <div className="flex justify-center items-center  top-[20%] md:top-[50%] absolute w-full">
          <div className="  h-full bg-opacity-25 w-fit  mx-2 md:mx-0 p-5 md:p-10  backdrop-blur-sm shadow-lg rounded-md border  ">
            <div className="text-center md:text-start  flex items-center justify-center text-white text-4xl font-semibold">
              Welcome to CumaNginep
            </div>
            <div className=" flex items-center text-center md:text-start justify-center text-2xl top-20 text-white font-semibold py-2 md:py-0">
              "Your Home Away from Home"
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="absolute  bottom-0 transform translate-y-[40%] md:translate-y-[50%] lg:w-[50vw]">
            <div className="bg-white mx-2 md:mx-0  px-5 py-2 rounded-md flex flex-wrap md:flex-nowrap gap-5 justify-center items-center drop-shadow-md">
              <div className="mx-auto ">
                <div className="mx-auto z-50">
                  <p>Tanggal CheckIn</p>
                  <input type="date" onChange={handleChangeCheckIn} value={startDateIn} className="bg-[#bedceb] px-3 py-4 rounded-md border-none" min={new Date().toISOString().split("T")[0]}/>
                </div>
              </div>
              <div className="hidden md:block">
                <TbMinusVertical className="text-3xl text-[#024f79] font-semibold" />
                <TbMinusVertical className="text-3xl text-[#024f79] font-semibold" />
                <TbMinusVertical className="text-3xl text-[#024f79] font-semibold" />
              </div>
              <div className="mx-auto z-50">
              <p>Tanggal CheckOut</p>

              <input type="date" onChange={handleChangeCheckOut} value={startDateOut} className="bg-[#bedceb] px-3 py-4 rounded-md border-none" min={new Date().toISOString().split("T")[0]}/>
              </div>
              <div className="hidden md:block">
                <TbMinusVertical className="text-3xl text-[#024f79] font-semibold" />
                <TbMinusVertical className="text-3xl text-[#024f79] font-semibold" />
                <TbMinusVertical className="text-3xl text-[#024f79] font-semibold" />
              </div>
              <div className="mx-auto">
                <button
                  className="bg-[#bedceb] px-3 py-4 rounded-md flex justify-center items-center gap-2"
                  onClick={handleCari}
                >
                  <CiSearch />
                  Cari Kamar!
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-5 mt-24 mx-10">
        <div className="my-10 z-10">
          {!loading && showList && (
            <p className="text-2xl text-center">
              LIST{" "}
              <span className=" border-b-[3px] border-[#024f79]">
                TIPE KAMAR
              </span>{" "}
              TERSEDIA
            </p>
          )}

          {!showError && !loading ? (
            <div className="flex flex-wrap gap-10 justify-center">
              {availableRooms?.map((item, index) => (
                <div className="my-5" key={index}>
                  <TypeCard
                    title={item.nama_tipe_kamar}
                    price={item.harga}
                    description={item.deskripsi}
                    foto={item.foto}
                    link={`/reservation/${item.nama_tipe_kamar}?Cin=${checkIn}&Cout=${checkOut}`}
                    available={item.available}
                  />
                </div>
              ))}
            </div>
          ) : loading ? (
            <SpinnerLoading />
          ) : (
            <div className="text-center  w-full flex justify-center">
              <div className="bg-red-200 rounded-md p-3 flex items-center gap-3">
                <div><CiWarning className="font-bold text-3xl text-red-600"/></div>
                <div className="text-red-600 font font-semibold">{errorMessage}</div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LandingPage;
