import React, { useState, useEffect } from "react";
import Image from "next/image";
// import Button from "@mui/material/Button";
import { useRouter } from "next/router";
import axios from "axios";
import moment from "moment";
import Navbar from "../../../components/elements/Navbar";

const Note = () => {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState([]);
  const [TypeRoom, setTypeRoom] = useState();
  const [night, setNight] = useState("");

  const downloadAsPdf = () => {
    if (typeof window !== "undefined") {
      const element = document.getElementById("note_container");
      const opt = {
        margin: 0,
        filename: "note.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 4 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };
      import("html2pdf.js").then((module) => {
        module.default().set(opt).from(element).save();
      });
    }
  };

  let token = "";
  let config = {};

  const GetOneTransaction = async () => {
    try {
      console.log("ini" + id);
      const fetchData = await axios.post(
        `http://localhost:8000/pemesanan/findOne`,
        { id: id },
        config
      );
      console.log("ll", fetchData.data.data);
      setData(fetchData.data.data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    token = window.localStorage.getItem("token");
    config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    if (id !== undefined) {
      GetOneTransaction();
    }
  }, [id]);

  useEffect(() => {
    if (data.tgl_check_in && data.tgl_check_out) {
      const startDate = moment(data.tgl_check_in);
      const endDate = moment(data.tgl_check_out);
      const duration = moment.duration(endDate.diff(startDate));
      const nights = Math.ceil(
        duration.asMilliseconds() / (1000 * 60 * 60 * 24)
      );
      setNight(nights);
    }

    const getTypeRoom = async (nama_tipe) => {
      const data = {
        nama_tipe_kamar: nama_tipe,
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

    if (data.nama_tipe_kamar) {
      getTypeRoom(data.nama_tipe_kamar);
    }
  }, [data]);

  

  return (
    <>
      <div className="md:px-20 px-[35%] pt-20 pb-5">
        <button
          className="border-2 border-[#024f79] text-[#024f79] hover:bg-[#024f79] hover:text-white px-4 py-2 flex md:block rounded-md "
          onClick={downloadAsPdf}
        >
          Download
        </button>
      </div>
      <div className="my-10 block md:hidden text-center mx-3">
        Klik Download untuk melihat nota anda
      </div>
      <div className="mx-16 hidden md:block my-4">
        <div className=" w-[210mm] " id="note_container">
          <div className="bg-[#024f79] pb-[0.5rem]">
            <div className="bg-[url('/images/invoice_bg.jpg')] h-[20vh] bg-cover bg-center">
              <div className="flex justify-between">
                <div className="flex items-center mx-5 mt-2">
                  <Image
                    src="/images/logo/logo_white.png"
                    width={200}
                    height={70}
                    alt="CumaNginep Logo"
                  />
                </div>
                <div className=" my-2 text-white mx-2">
                  <div className="text-end">
                    <h5 className="text-xs font-semibold">
                      {data?.nomor_pemesanan}
                    </h5>
                  </div>
                  <div className="flex gap-7 mt-7">
                    <div>
                      <h3 className="font-bold">Tgl Check In</h3>
                      <p className="text-sm">{data?.tgl_check_in}</p>
                    </div>
                    <div>
                      <h3 className="font-bold">Tgl Check Out</h3>
                      <p className="text-sm">{data?.tgl_check_out}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white w-[98%] mx-auto pb-[0.1rem]">
              <div className="flex justify-between mx-[1rem] pt-[2rem]">
                <div>
                  <h3>Kepada / a.n:</h3>
                  <h1 className="text-2xl font-semibold my-2">{data?.nama_pemesanan}</h1>
                  <h4 className="text-sm font-semibold">{data?.email_pemesanan}</h4>
                </div>
                <div>
                  <h1 className="text-[#024f79] text-2xl font-bold">Invoice</h1>
                  <h2 className="font-semibold">Hotel & Resto</h2>
                </div>
              </div>
              <div >
                <h1 className="text-[#024f79] text-2xl mx-[1rem] mt-[2rem] mb-[1rem] font-bold">Layanan Hotel</h1>
                <table className=" w-[97%] mx-auto text-center">
                  <thead>
                    <tr>
                      <th className="py-[1rem] pl-[10px]">Deskripsi</th>
                      <th className="py-[1rem] pl-[10px]">Nomor Kamar</th>
                      <th className="py-[1rem] pl-[10px]">Waktu (Malam)</th>
                      <th className="py-[1rem] pl-[10px]">Harga /Malam</th>
                      <th className="py-[1rem] pl-[10px]">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border-y-[5px] border-[#024f79] pt-[20px] pb-[30px]">{data?.nama_tipe_kamar}</td>
                      <td className="border-y-[5px] border-[#024f79] pt-[20px] pb-[30px]">
                          {data?.nomor_kamar?.map((kamar, index) => (
                            <React.Fragment key={index}>
                              {kamar.nomor_kamar}
                              {index !== data.nomor_kamar.length - 1 && (
                                <span>, </span>
                              )}
                            </React.Fragment>
                          ))}
                        </td>
                      <td className="border-y-[5px] border-[#024f79] pt-[20px] pb-[30px]">{night}</td>
                      <td className="border-y-[5px] border-[#024f79] pt-[20px] pb-[30px]">{TypeRoom?.harga}</td>
                      <td className="border-y-[5px] border-[#024f79] pt-[20px] pb-[30px]">{data?.harga}</td>
                    </tr>
                  </tbody>
                </table>
                <h1 className="text-[#024f79] mt-[2rem] mx-[1rem] mb-[1rem] font-bold text-2xl">Layanan Lain</h1>
                <table className=" w-[97%] mx-auto text-center">
                  <thead>
                    <tr>
                      <th className="py-[1rem] pl-[10px]">Deskripsi</th>
                      <th className="py-[1rem] pl-[10px]">Jumlah</th>
                      <th className="py-[1rem] pl-[10px]">Harga Satuan</th>
                      <th className="py-[1rem] pl-[10px]">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border-y-[5px] border-[#024f79] pt-[20px] pb-[30px]">-</td>
                      <td className="border-y-[5px] border-[#024f79] pt-[20px] pb-[30px]">-</td>
                      <td className="border-y-[5px] border-[#024f79] pt-[20px] pb-[30px]">-</td>
                      <td className="border-y-[5px] border-[#024f79] pt-[20px] pb-[30px]">-</td>
                    </tr>
                  </tbody>
                </table>
                <div className="mx-[2rem] mt-[2rem] mb-[5rem] flex justify-end text-[#024f79]">
                  <div>
                    <div className="flex justify-between font-bold">
                      <h4>Jumlah:</h4>
                      <h4>Rp {data?.harga}</h4>
                    </div>
                    <div className="flex justify-between font-bold">
                      <h4>Diskon:</h4>
                      <h4>-</h4>
                    </div>
                    <h2 className="mt-[2rem] text-xl font-bold">
                      Total Bayar: <span>Rp {data?.harga}</span>
                    </h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-white text-3xl text-center my-[1rem]">
            <h2 className="thanks_text">Terima Kasih Telah Menginap di CumaNginep</h2>
              <hr className="w-[30%] mx-auto my-5 border-[1px] border-white"/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const index = () => {
  return (
    <div className="">
      <div>
        <Navbar />
      </div>
      <div>{Note()}</div>
    </div>
  );
};

export default index;
