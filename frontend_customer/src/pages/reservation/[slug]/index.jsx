import { useRouter } from "next/router";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { CiWarning } from "react-icons/ci";
import { BsArrowLeft } from "react-icons/bs";
import { getTokenCookie } from "../../../utils/HandleCookie";
import jwt from "jsonwebtoken";
import { TbMinusVertical } from "react-icons/tb";
import moment from "moment";
import Footer from "../../../components/elements/Footer";
import Navbar from "../../../components/elements/Navbar";
import Modal from "../../../components/elements/Modal";
import ModalBooking from "../../../components/elements/ModalBooking";
import ModalLogin from "../../../components/elements/ModalLogin";


const index = () => {
  const [typeRoom, setTypeRoom] = useState();
  const [modalShow, setModalShow] = useState(false);
  const router = useRouter();
  const { slug, Cin, Cout } = router.query;

  const [token, setToken] = useState("");
  const [userData, setUserData] = useState("");
  const [sisaKamar, setSisaKamar] = useState();
  // const token = getTokenCookie();
  console.log(userData);
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

  useEffect(() => {
    const getTypeRoom = async () => {
      const data = {
        nama_tipe_kamar: slug,
      };
      try {
        const getDetailTypeRoom = await axios.post(
          "http://localhost:8000/tipe/findOne",
          data
        );
        setTypeRoom(getDetailTypeRoom.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (slug) {
      getTypeRoom();
    }
  }, [slug]);

  const [JumlahKamar, setJumlahKamar] = useState(1); // Inisialisasi nilai awal dengan 1

  const handleChange = (event) => {
    // Ambil nilai dari input
    const newValue = event.target.value;

    // Periksa apakah nilai berada dalam rentang 1 hingga 50
    if (newValue >= 1 && newValue <= sisaKamar) {
      setJumlahKamar(newValue); // Set nilai baru jika valid
    }
  };

  const checkInDate = moment(Cin);
  const checkOutDate = moment(Cout);

  // Menghitung jumlah malam
  const numberOfNights = checkOutDate.diff(checkInDate, "days");
  const totalHarga = numberOfNights * typeRoom?.harga * JumlahKamar;

  const closeModal = () => setModalShow(false);

  useEffect(() => {
    const getAvailableRoom = async () => {
      try {
        const data = {
          nama_tipe: slug,
          check_in: Cin,
          check_out: Cout,
        };
  
        const checkAvailableRoom = await axios.post(
          "http://localhost:8000/kamar/getAvailableWType",
          data
        );
        // console.log(checkAvailableRoom, "lklk");
  
        setSisaKamar(checkAvailableRoom.data.sisa_kamar);
      } catch (error) {
        console.error("Error fetching available rooms: ", error);
        return null;
      }
    };
    if (slug) {
      getAvailableRoom();
      // console.log(sisa);
    }
  }, [slug]);

  const [isModalOpen, setIsModalOpen] = useState(false);


  const openModal = () => setIsModalOpen(true);
  const closeModalLogin = () => setIsModalOpen(false);


  return (
    <div className="min-h-screen">
      <ModalLogin isOpen={isModalOpen} closeModal={closeModalLogin} />
      <Modal isOpen={modalShow} onClose={closeModal}>
        <ModalBooking
          RoomData={typeRoom}
          Cin={Cin}
          Cout={Cout}
          jumlahKamar={JumlahKamar}
          DataUser={userData}
        />
      </Modal>
      <div className="bg-[#024f79] relative z-99">
        <Navbar />
      </div>
      <div className="p-10">
        <div
          className="flex items-center gap-2 cursor-pointer w-fit py-10"
          onClick={() => router.back()}
        >
          <BsArrowLeft />
          <p>Back to prev page</p>
        </div>
        {typeRoom && sisaKamar > 0 && (
          <div className="w-full">
            <div className="my-5 flex justify-center drop-shadow-md">
              <Image
                src={`http://localhost:8000/${typeRoom.foto}`}
                width={1000}
                height={1000}
                alt="type room foto"
                className="border-2 rounded-md w-fit md:h-96 object-contain relative z-1"
              />
            </div>
            <div className="flex  flex-col md:flex-row justify-between mx-5  mt-12">
              <div className="md:w-6/12">
                <p className="text-2xl font-semibold text-[#024f79]">
                  {typeRoom.nama_tipe_kamar}
                </p>
                <p className="my-10">{typeRoom.deskripsi}</p>
              </div>
              <div className="md:w-6/12 flex justify-center md:justify-end">
                <div className="md:w-6/12 ">
                  {!token && (
                    <div className="bg-[#024f79] text-white flex p-3 justify-between items-center gap-3 md:gap-0 text-center md:text-start rounded-t-md">
                      <p>Login To Book this room</p>
                      <button className="bg-white bg-opacity-25 px-3 rounded-md" onClick={openModal}>
                        <span className="text-white opacity-100">Login</span>
                      </button>
                    </div>  
                  )}
                  <div
                    className={`border-2 p-3 ${
                      token ? "rounded-md" : "rounded-b-md"
                    }`}
                  >
                    <div className="mt-3">
                      <p className="font-bold text-2xl">Rp {typeRoom.harga}</p>
                    </div>
                    <div className="my-3 border-2 p-2 rounded-xl flex ">
                      <div className="mx-auto text-center">
                        <p className="text-xs font-semibold my-1 text-gray-500">
                          Check In
                        </p>
                        <p>{Cin}</p>
                      </div>
                      <div className="flex justify-center items-center">
                        <TbMinusVertical className="text-3xl opacity-25" />
                      </div>
                      <div className="mx-auto text-center">
                        <p className="text-xs font-semibold my-1 text-gray-500">
                          Check Out
                        </p>
                        <p>{Cout}</p>
                      </div>
                    </div>
                    <div className="border-2 rounded-xl p-3 flex justify-center items-center gap-2">
                      <p className="text-xs font-semibold my-1 text-gray-500">
                        Jumlah Kamar
                      </p>
                      <input
                        type="number"
                        id="numberInput"
                        name="numberInput"
                        value={JumlahKamar}
                        onChange={handleChange}
                        min={1} // Nilai minimum
                        max={50} // Nilai maksimum
                        className="rounded-xl focus:border-none active:border-none"
                      />
                    </div>
                    <div className="border-2 rounded-xl p-3 my-3 text-center">
                      <p className="text-xs font-semibold my-1 text-gray-500">
                        Tipe Kamar
                      </p>
                      <p className="my-1 font-semibold">
                        {typeRoom.nama_tipe_kamar}
                      </p>
                    </div>
                    <div className="flex justify-between my-3">
                      <p>Total Harga</p>
                      <p>Rp {totalHarga}</p>
                    </div>
                    <div className="w-full flex justify-center">
                      <button
                        className={`${!token ? 'bg-[#66acd2] opacity-20':'bg-[#024f79]'} w-full text-white py-2 rounded-md`}
                        onClick={() => setModalShow(true)}
                        disabled={!token ? true:false}
                      >
                        Pesan Sekarang
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {sisaKamar === 0 && <div className="text-center  w-full flex justify-center">
          <div className="bg-red-200 rounded-md p-3 flex items-center gap-3">
            <div>
              <CiWarning className="font-bold text-3xl text-red-600" />
            </div>
            <div className="text-red-600 font font-semibold">
              Mohon maaf ternyata kamar dengan tipe itu sudah dibooking semua
            </div>
          </div>
        </div>}
      </div>
      {sisaKamar > 0 && <Footer />}
    </div>
  );
};

export default index;
