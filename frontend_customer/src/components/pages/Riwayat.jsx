import React, { useState, useEffect } from "react";
import { getTokenCookie } from "../../utils/HandleCookie";
import axios from "axios";
import jwt from "jsonwebtoken";
import { CiWarning } from "react-icons/ci";
import ReactPaginate from "react-paginate";
import { GrNext, GrPrevious } from "react-icons/gr";
import Link from "next/link";
import moment from "moment";
import Modal from "../elements/Modal";

const Riwayat = () => {
  const [pemesananData, setPemesananData] = useState();
  const [userData, setUserData] = useState("");
  const [token, setToken] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [keywordDate, setKeywordDate] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [detail, setDetail] = useState();
  const pageSize = 10;
  const [totalPages, setTotalPages] = useState(0);
  // const [currentData, setCurrentData] = useState()

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
    const getDataPemesanan = async () => {
      if (
        !keywordDate ||
        keywordDate === "" ||
        keywordDate === null ||
        keywordDate === undefined ||
        keywordDate === "Invalid date"
      ) {
        try {
          const data = { email: userData.email };
          const getData = await axios.post(
            "http://localhost:8000/pemesanan/getUserReservation",
            data
          );
          setPemesananData(getData.data.data);
          console.log(getData.data.data, "lklk");
        } catch (error) {
          console.log(error);
        }
      } else if (
        keywordDate ||
        !keywordDate === "" ||
        !keywordDate === null ||
        !keywordDate === undefined
      ) {
        try {
          const data = { email: userData.email, tgl_pemesanan: keywordDate };
          const getData = await axios.post(
            "http://localhost:8000/pemesanan/getUserReservationwDate",
            data
          );
          setPemesananData(getData.data.data);
          console.log(getData.data.data, "lklk");
        } catch (error) {
          console.log(error);
        }
      }
    };
    if (userData) {
      getDataPemesanan();
    }
    console.log(keywordDate, "lklkmm");
  }, [userData, keywordDate]);
  
  useEffect(()=>{
    const totalItems = pemesananData?.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    setTotalPages(totalPages);
  },[pemesananData])

  // const pageCount = Math.ceil(pemesananData?.length / 10);
  // const handlePageClick = (event) => {
  //   const newOffset = (event.selected * 10) % pemesananData?.length;
  //   console.log(
  //     `User requested page number ${event.selected}, which is offset ${newOffset}`
  //   );
  //   setCurrentPage(newOffset);
  // };

  // const startIndex = currentPage  ;

  // useEffect(()=>{
  // const endIndex = currentPage + 10;
  // setCurrentData(pemesananData?.slice(currentPage, endIndex))
  // },[currentPage])
  const openModalDetail = async (id) => {
    try {
      const fetchData = await axios.post(
        `http://localhost:8000/pemesanan/findOne`,
        { id: id }
        // config
      );
      const data = fetchData.data.data[0];
      setDetail(data);
      setOpenModal(true);
      console.log(data, "lll");
    } catch (error) {
      console.log(error);
    }
  };

  const closeModalDetail = () => {
    setOpenModal(false);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = pemesananData?.slice(startIndex, endIndex);

  const RenderPageButtons = () => {
    const pageButtons = [];

    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);

    if (startPage === 2) {
      pageButtons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          style={{
            padding: "1rem",
            backgroundColor: "#024f79",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            marginLeft: "5px",
            cursor: "pointer",
          }}
        >
          1
        </button>
      );
    } else if (startPage > 2) {
      pageButtons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          style={{
            padding: "1rem",
            backgroundColor: "#024f79",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            marginLeft: "5px",
            cursor: "pointer",
          }}
        >
          1
        </button>
      );
      pageButtons.push(
        <span style={{ paddingTop: "10px", paddingLeft: "2px" }} key="dots1">
          ...
        </span>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          disabled={i === currentPage}
          style={{
            padding: "1rem",
            backgroundColor: "#024f79",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            marginLeft: "5px",
            cursor: "pointer",
            opacity: i === currentPage ? 0.5 : 1,
            pointerEvents: i === currentPage ? "none" : "auto",
          }}
        >
          {i}
        </button>
      );
    }

    if (endPage === totalPages - 1) {
      pageButtons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          style={{
            padding: "1rem",
            backgroundColor: "#024f79",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            marginLeft: "5px",
            cursor: "pointer",
          }}
        >
          {totalPages}
        </button>
      );
    } else if (endPage < totalPages - 1) {
      pageButtons.push(
        <span style={{ paddingTop: "10px", paddingLeft: "2px" }} key="dots2">
          ...
        </span>
      );
      pageButtons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          style={{
            padding: "1rem",
            backgroundColor: "#024f79",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            marginLeft: "5px",
            cursor: "pointer",
          }}
        >
          {totalPages}
        </button>
      );
    }

    return pageButtons;
  };

  return (
    <>
      <Modal isOpen={openModal} onClose={closeModalDetail}>
        <div className="mt-5">
          {detail &&
            Object.entries(detail).map(([key, value]) =>
              key === "nomor_kamar" ? (
                <div className="flex justify-between gap-10 py-1 ">
                  <div className="p-2">Nomor Kamar</div>
                  <div className="flex flex-wrap gap-1">
                    {detail?.nomor_kamar.map((kamar, index) => (
                      <div key={index} className="bg-[#bedceb] p-2 rounded-md ">
                        {kamar.nomor_kamar}
                      </div>
                    ))}
                  </div>
                </div>
              ) : key === "id" || key === "nama_user" ? (
                <div>{""}</div>
              ) : (
                <div className="flex justify-between gap-10 py-1">
                  <div className="p-2">{key}</div>
                  <div className="bg-[#bedceb] p-2 rounded-md">{value}</div>
                </div>
              )
            )}
        </div>
      </Modal>
      {token ? (
        pemesananData?.length > 0 ? (
          <div className="m-5">
            <div>
              <p className="text-2xl text-[#024f79] font-semibold">
                Riwayat Pesanan Anda
              </p>
            </div>
            <div className="font-bold text-[#024f79] my-3">
              Silakan cek gmail anda secara berkala untuk melihat sudah diverifikasi atau belum.
              <div className="text-sm font-thin">
                Apabila pesanan anda tidak ada di list dibawah maka pesanan tersebut ditolak
              </div>
            </div>
            <div className="my-4 flex items-center gap-3">
              <div>
                <p>Search by tanggal pesan</p>
              </div>
              <div>
                <input
                  type="date"
                  onChange={(e) =>
                    setKeywordDate(moment(e.target.value).format("YYYY-MM-DD"))
                  }
                />
              </div>
            </div>
            <div className="my-3 text-center overflow-auto md:w-full max-w-[98%]">
              <table className="overflow-auto  border-2">
                <thead className="">
                  <tr key="" className="border-3">
                    <th className="p-3">Nama Pemesan</th>
                    <th className="p-3">Email Pemesan</th>
                    <th className="p-3">Tanggal Pemesanan</th>
                    <th className="p-3">Tanggal CheckIn</th>
                    <th className="p-3">Tanggal CheckOut</th>
                    <th className="p-3">Nama Tamu</th>
                    <th className="p-3">Status Pemesanan</th>
                    <th className="p-3">Nama Tipe Kamar</th>
                    <th className="p-3">Detail</th>
                    <th className="p-3">Nota</th>
                  </tr>
                </thead>
                <tbody>
                  {pemesananData &&
                    currentData?.map((item, index) => (
                      <tr
                        key={index + 1}
                        className={`border-2 ${
                          index % 2 === 0 ? "bg-gray-100" : ""
                        }`}
                      >
                        <td className="px-3 py-2">{item.nama_pemesanan}</td>
                        <td className="px-3 py-2">{item.email_pemesanan}</td>
                        <td className="px-3 py-2">{item.tgl_pemesanan}</td>
                        <td className="px-3 py-2">{item.tgl_check_in}</td>
                        <td className="px-3 py-2">{item.tgl_check_out}</td>
                        <td className="px-3 py-2">{item.nama_tamu}</td>
                        <td className="px-3 py-2">
                          {item.nama_user === null
                            ? "belum diverifikasi"
                            : "sudah diverivikasi"}
                        </td>
                        <td className="px-3 py-2">{item.nama_tipe_kamar}</td>
                        <td
                          className="px-3 py-2 text-[#024f79] cursor-pointer"
                          onClick={(e) => openModalDetail(item.id)}
                        >
                          <u>Lihat</u>
                        </td>
                        <td className="px-3 py-2 text-[#024f79] cursor-pointer">
                          <u>
                            <Link href={`/Nota/${item.id}`}>download</Link>
                          </u>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {/* <ReactPaginate
              breakLabel="..."
              nextLabel={<GrNext />}
              activeClassName="bg-[#024f79] text-white"
              pageClassName="border-2 rounded-md py-2 px-3"
              onPageChange={handlePageClick}
              pageRangeDisplayed={1}
              pageCount={pageCount}
              previousLabel={<GrPrevious />}
              renderOnZeroPageCount={null}
              className="flex gap-3 justify-end my-7 items-center"
            /> */}
            <div className="flex justify-end my-4 mx-5">
              <RenderPageButtons />
            </div>
          </div>
        ) : keywordDate ? (
          <div className="m-5">
            <div>
              <p className="text-2xl text-[#024f79] font-semibold">
                Riwayat Pesanan Anda
              </p>
            </div>
            <div className="my-4 flex items-center gap-3">
              <div>
                <p>Search by tanggal pesan</p>
              </div>
              <div>
                <input
                  type="date"
                  onChange={(e) =>
                    setKeywordDate(moment(e.target.value).format("YYYY-MM-DD"))
                  }
                />
              </div>
            </div>
            <div className="my-3 text-center w-full">
              <table className="overflow-auto border-2">
                <thead className="">
                  <tr key="" className="border-3">
                    <th className="p-3">Nama Pemesan</th>
                    <th className="p-3">Email Pemesan</th>
                    <th className="p-3">Tanggal Pemesanan</th>
                    <th className="p-3">Tanggal CheckIn</th>
                    <th className="p-3">Tanggal CheckOut</th>
                    <th className="p-3">Nama Tamu</th>
                    <th className="p-3">Status Pemesanan</th>
                    <th className="p-3">Nama Tipe Kamar</th>
                    <th className="p-3">Detail</th>
                    <th className="p-3">Nota</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr key="">{""}</tr>
                </tbody>
              </table>
              <div className="bg-red-200 text-center flex justify-center ">
                Tidak ada pesanan di tanggal itu
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center my-10 w-full flex justify-center">
            <div className="bg-yellow-200 rounded-md p-3 ">
              <div className="flex items-center gap-3">
                <div>
                  <CiWarning className="font-bold text-3xl text-yellow-600" />
                </div>
                <div className="text-yellow-600 font-semibold">
                  Anda belum melakukan pemesanan sama sekali, silahkan pesan
                  terlebih dahulu
                </div>
              </div>
              <div className="text-yellow-600 font font-semibold">
                <u>
                  <Link href={"/"}>Pesan Sekarang</Link>
                </u>
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="text-center my-10 w-full flex justify-center">
          <div className="bg-yellow-200 rounded-md p-3 flex items-center gap-3">
            <div>
              <CiWarning className="font-bold text-3xl text-yellow-600" />
            </div>
            <div className="text-yellow-600 font font-semibold">
              Silahkan Login terlebih dahulu untuk melihat riwayat pesanan anda
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Riwayat;
