import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import SpinnerLoading from "./SpinnerLoading";
import { CiWarning } from "react-icons/ci";
import { BiCheckDouble } from "react-icons/bi";

const ModalBooking = ({ RoomData, Cin, Cout, jumlahKamar, DataUser }) => {
  const [namaPemesan, setNamaPemesan] = useState(DataUser.name);
  const [namaTamu, setNamaTamu] = useState("");
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSend = async () => {
    setLoading(true);
    setShowError(false);
    try {
      const data = {
        nama_pemesanan: namaPemesan,
        email_pemesanan: DataUser.email,
        check_in: Cin,
        check_out: Cout,
        nama_tamu: namaTamu,
        tipe_kamar: RoomData.nama_tipe_kamar,
        jumlah_kamar: jumlahKamar,
      };
      const sendData = await axios.post(
        "http://localhost:8000/pemesanan/Reservation",
        data
      );
      console.log("berhasil", sendData.data.success);
      setTimeout(() => {
        setLoading(false);
        if (sendData.data.success === true) {
          setSuccess(true);
            setTimeout(() => {
              router.push("/Riwayat");
            }, 2000);
        } else {
          setShowError(true);
          setErrorMessage(sendData.data.message);
        }
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className=" mx-2 md:mx-0 md:px-3 mt-3">
      <div className="flex gap-3 justify-center">
        <div>
          <p className="text-gray-500 font-semibold text-center">Check In</p>
          <input
            type="date"
            value={Cin}
            disabled
            className="bg-gray-200 text-gray-500 rounded-md"
            required
          />
        </div>
        <div>
          <p className="text-gray-500 font-semibold text-center">Check Out</p>
          <input
            type="date"
            value={Cout}
            disabled
            className="bg-gray-200 text-gray-500 rounded-md"
            required
          />
        </div>
      </div>
      <div className="flex flex-wrap md:flex-nowrap gap-3 my-5 justify-center">
        <div>
          <p className="text-gray-500 font-semibold text-center">
            Nama Pemesan
          </p>
          <input
            type="text"
            value={namaPemesan}
            className=" rounded-md"
            onChange={(e) => setNamaPemesan(e.target.value)}
            required
          />
        </div>
        <div>
          <p className="text-gray-500 font-semibold text-center">
            Email Pemesan
          </p>
          <input
            type="text"
            value={DataUser.email}
            disabled
            className="bg-gray-200 text-gray-500 rounded-md"
            required
          />
        </div>
      </div>
      <div className="flex gap-3 flex-wrap md:flex-nowrap justify-center my-5">
        <div>
          <p className="text-gray-500 font-semibold text-center">Nama Tamu </p> 
          <input
            type="text"
            value={namaTamu}
            onChange={(e) => setNamaTamu(e.target.value)}
            className=" rounded-md"
            required
          />
        </div>
        <div>
          <p className="text-gray-500 font-semibold text-center">
            Nama Tipe Kamar
          </p>
          <input
            type="text"
            value={RoomData.nama_tipe_kamar}
            disabled
            className="bg-gray-200 text-gray-500 rounded-md"
            required
          />
        </div>
      </div>
      <div className="w-full flex justify-center my-5">
        <div className="mx-auto">
          <p className="text-gray-500 font-semibold text-center">
            Jumlah Kamar
          </p>
          <input
            type="number"
            value={jumlahKamar}
            className="bg-gray-200 text-gray-500 rounded-md text-center"
            disabled
          />
        </div>
      </div>
      {loading && (
        <div className="flex justify-center">
          <SpinnerLoading />
        </div>
      )}
      {showError && (
        <div className="text-center  w-full flex justify-center">
          <div className="bg-red-200 rounded-md p-3 flex items-center gap-3">
            <div>
              <CiWarning className="font-bold text-3xl text-red-600" />
            </div>
            <div className="text-red-600 font font-semibold">
              {errorMessage}
            </div>
          </div>
        </div>
      )}
      {success && (
        <div className="text-center  w-full flex justify-center">
          <div className="bg-green-200 rounded-md p-3 flex items-center gap-3">
            <div>
              <BiCheckDouble className="font-bold text-3xl text-green-600" />
            </div>
            <div className="text-green-600 font font-semibold">
              Sukses Memesan Kamar
            </div>
          </div>
        </div>
      )}
      <div className="mt-5">
        <button
          className="bg-[#024f79] w-full text-white py-2 rounded-md"
          onClick={handleSend}
        >
          Pesan Sekarang
        </button>
      </div>
    </div>
  );
};

export default ModalBooking;
