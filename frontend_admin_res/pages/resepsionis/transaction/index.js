import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../../styles/TransactionRes.module.css";
import Navbar from "../../../components/Navbar";
import { Button } from "@mui/material";
import Modal from "react-modal";
import { AiOutlineClose } from "react-icons/ai";
import Link from "next/link";
import { useRouter } from "next/router";
import ConfirmationDialog from "../../../components/ModalVerify";
import Select from "react-select";
import ModalChangeStatus from "../../../components/ModalChange";
import emailjs from "@emailjs/browser";
import withAuth from "../../withAuth";


let token = "";
let nama_user = "";
let config = {};
function index() {
  const pageSize = 10; // number of items to display per page
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [detail, setDetail] = useState([]);
  const [idRoom, setIdRoom] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isShow, setIsShow] = useState(false);
  const [error, setError] = useState(false);
  const [keyword, setKeyword] = useState(null);
  const [keywordCheckIn, setKeywordceckIn] = useState(null);
  const [keywordName, setKeywordName] = useState(null);
  const [check, setCheck] = useState(false);
  const [verifyRes, setVerifyRes] = useState(false);
  const [idTrans, setidTrans] = useState("");
  const [openModalStatus, setOpenModalStatus] = useState(false);
  const [openModalChangeStatus, setOpenModalChangeStatus] = useState(false);
  const [statusPem, setStatusPem] = useState("");
  const [dataEmail, setDataEmail] = useState([]);

  const router = useRouter();

  useEffect(() => {
    token = window.localStorage.getItem("token");
    nama_user = window.localStorage.getItem("nama_user");
    config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, []);

  const fetchData = async () => {
    try {
      let response;
      if (keyword === null && keywordCheckIn === null && keywordName === null) {
        response = await axios.get(
          "http://localhost:8000/pemesanan/getAll",
          config
        );
      } else {
        if (
          keywordCheckIn === null &&
          keyword !== null &&
          keywordName === null
        ) {
          response = await axios.post(
            "http://localhost:8000/pemesanan/findOne",
            { status: keyword },
            config
          );
        } else if (
          keywordCheckIn !== null &&
          keyword === null &&
          keywordName === null
        ) {
          response = await axios.post(
            "http://localhost:8000/pemesanan/findOne",
            { check_in: keywordCheckIn },
            config
          );
        } else if (
          keywordCheckIn === null &&
          keyword === null &&
          keywordName !== null
        ) {
          response = await axios.post(
            "http://localhost:8000/pemesanan/findOne",
            { nama_tamu: keywordName },
            config
          );
        }
      }
      let responseData = response.data.data;
      console.log("response", responseData);
      setError(false);
      if (!Array.isArray(responseData)) {
        responseData = [responseData]; // Convert to array if it's not already
      }
      setCheck(response.data.success);
      const totalItems = responseData.length;
      const totalPages = Math.ceil(totalItems / pageSize);
      setTotalPages(totalPages);
      setData([...responseData]); // Create a new array with spread syntax
    } catch (error) {
      setIsShow(true);
      setErrorMessage(error?.response?.data?.message);
      setError(true);
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
    console.log("check", keywordName);
  }, [keyword, keywordCheckIn, keywordName]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const openEditModal = (id, status) => {
    setidTrans(id);
    setStatusPem(status);
    setOpenModalChangeStatus(true);
  };

  const closeEditModal = () => {
    // setidTrans(id)
    setOpenModalStatus(false);
  };
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = data.slice(startIndex, endIndex);

  const renderPageButtons = () => {
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

  const customStyles = {
    content: {
      top: "20%",
      left: "35%",
      right: "auto",
      bottom: "auto",
      padding: "1rem",
      width: "40%",
    },
  };

  const filterOption = [
    { value: null, label: "All" },
    { value: "baru", label: "Baru" },
    { value: "checkin", label: "CheckIn" },
    { value: "checkout", label: "CheckOut" },
  ];

  const openModalDetail = async (id) => {
    try {
      const fetchData = await axios.post(
        `http://localhost:8000/pemesanan/findOne`,
        { id: id },
        config
      );
      const data = fetchData.data.data[0];
      setDetail(data);
      setOpenModal(true);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  function closeModal() {
    setOpenModal(false);
  }

  const openConfirmVer = async (id) => {
    setidTrans(id);
    setVerifyRes(true);
  };

  const handleVerify = async () => {
    try {
      let data = {
        idPemesanan: idTrans,
        nama_user: nama_user,
      };
      const verifyReser = await axios.post(
        `http://localhost:8000/pemesanan/VerifyReservation`,
        data,
        config
      );
      const fetchData = await axios.post(
        `http://localhost:8000/pemesanan/findOne`,
        { id: idTrans },
        config
      );
      const dataPem = fetchData.data.data[0];
      setDataEmail(dataPem);
      console.log(dataEmail);
      const nomorKamar = dataPem.nomor_kamar
        .map((kamar, index) => kamar.nomor_kamar)
        .join(", ");

      const templateParams = {
        status: "diterima",
        tgl_pemesanan:dataPem.tgl_pemesanan,
        message:
          "Silakan check in ditanggal yang sesuai pada pukul 12.00 dan checkout pukul 12.00 di tanggal yang sesuai,dan jangan lupa untuk membawa bukti nota yang bisa download pada halaman riwayat.",
        target: dataPem.email_pemesanan,
        name: dataPem.nama_pemesanan,
        checkin: dataPem.tgl_check_in,
        checkout: dataPem.tgl_check_out,
        tipe_kamar: dataPem.nama_tipe_kamar,
        nomor_kamar: nomorKamar,
      };
      emailjs
        .send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE,
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE,
          templateParams,
          process.env.NEXT_PUBLIC_EMAILJS_KEY
        )
        .then(
          (response) => {
            console.log("SUCCESS!", response.status, response.text);
            setTimeout(()=>{
              setVerifyRes(false);
              window.location.reload()
            },1500)
          },
          (err) => {
            console.log("FAILED...", err);  
          }
        );

    } catch (error) {
      console.log(error);
      setIsShow(true);
      setErrorMessage(error.response.data.message);
      setError(true);
    }
  };

  const handleCancelVer = async () => {
    setVerifyRes(false);
  };
  const handleClick = (id) => {
    setIdRoom(id);
    setShowConfirmation(true);
  };
  const customStyles2 = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#024f795d" : "e8e8f0",
      color: state.isSelected ? "black" : "black",
      ":hover": {
        backgroundColor: state.isSelected ? "" : "#024f795d",
      },
    }),
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#FFF",
      overflow: "auto",
      border: state.isFocused ? "2px solid gray" : "",
      boxShadow: state.isFocused ? "none !important" : "none",
      outline: "none",
      ":hover": {
        border: "2px solid gray",
      },
    }),
    menu: (provided, state) => ({
      ...provided,
      maxHeight: "200px",
    }),
  };

  const handleDateChange = (e) => {
    if (e.target.value === "") {
      setKeywordceckIn(null);
    } else {
      setKeywordceckIn(e.target.value);
    }
  };

  const handleChangeName = (e) => {
    if (e.target.value === "") {
      setKeywordName(null);
    } else {
      setKeywordName(e.target.value);
    }
  };

  const editModal = () => (
    <Modal
      isOpen={openModal}
      // onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Example Modal"
      bodyOpenClassName=".popup"
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "20px",
        }}
      >
        <h4>Edit Transaction</h4>
        <div
          style={{ cursor: "pointer", fontSize: "x-large" }}
          onClick={closeModal}
        >
          <AiOutlineClose />
        </div>
      </div>
      <div className={styles.detail_spec}>
        <table>
          <tbody>
            {detail &&
              Object.entries(detail).map(([key, value]) => (
                <tr key={key}>
                  <td>
                    <span>{key}</span>
                  </td>
                  <td>
                    :{" "}
                    {key === "nomor_kamar" ? (
                      detail?.nomor_kamar.map((kamar, index) => (
                        <React.Fragment key={index}>
                          {kamar.nomor_kamar}
                          {index !== detail.nomor_kamar.length - 1 && (
                            <span>, </span>
                          )}
                        </React.Fragment>
                      ))
                    ) : key === "nama_user" ? (
                      detail?.nama_user === "null" ? (
                        <span>-</span>
                      ) : (
                        value
                      )
                    ) : (
                      value
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );

  const onCloseModalChangeStatus = () => {
    setOpenModalChangeStatus(false);
  };

  const handleReject = async () => {
    try {
      const fetchData = await axios.post(
        `http://localhost:8000/pemesanan/findOne`,
        { id: idTrans },
        config
      );
      const dataPem = fetchData.data.data[0];
      setDataEmail(dataPem);
      console.log(dataEmail);
      const nomorKamar = dataPem.nomor_kamar
        .map((kamar, index) => kamar.nomor_kamar)
        .join(", ");

      const templateParams = {
        status: "ditolak",
        tgl_pemesanan:dataPem.tgl_pemesanan,
        message:
          "Mohon maaf pesanan anda ditolak silahkan mencoba memesan lagi .",
        target: dataPem.email_pemesanan,
        name: dataPem.nama_pemesanan,
        checkin: dataPem.tgl_check_in,
        checkout: dataPem.tgl_check_out,
        tipe_kamar: dataPem.nama_tipe_kamar,
        nomor_kamar: nomorKamar,
      };
      emailjs
        .send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE,
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE,
          templateParams,
          process.env.NEXT_PUBLIC_EMAILJS_KEY
        )
        .then(
          async (response) => {
            console.log("SUCCESS!", response.status, response.text);
            const deleteData = await axios.delete(
              `http://localhost:8000/pemesanan/${idTrans}`,
              config
            );
            setTimeout(()=>{
              setVerifyRes(false);
              window.location.reload()
            },1500)
          },
          (err) => {
            console.log("FAILED...", err);
          }
        );

    } catch (error) {
      console.log(error);
      setIsShow(true);
      setErrorMessage(error.response.data.message);
      setError(true);
    }
  };

  return (
    <>
      <div>
        <Navbar />
      </div>
      <div className="popup">
        <Modal
          isOpen={openModal}
          // onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
          bodyOpenClassName=".popup"
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "20px",
            }}
          >
            <h4>Transaction Detail</h4>
            <div
              style={{ cursor: "pointer", fontSize: "x-large" }}
              onClick={closeModal}
            >
              <AiOutlineClose />
            </div>
          </div>
          <div className={styles.detail_spec}>
            <table>
              <tbody>
                {detail &&
                  Object.entries(detail).map(([key, value]) => (
                    <tr key={key}>
                      <td>
                        <span>{key}</span>
                      </td>
                      <td>
                        :{" "}
                        {key === "nomor_kamar" ? (
                          detail?.nomor_kamar.map((kamar, index) => (
                            <React.Fragment key={index}>
                              {kamar.nomor_kamar}
                              {index !== detail.nomor_kamar.length - 1 && (
                                <span>, </span>
                              )}
                            </React.Fragment>
                          ))
                        ) : key === "nama_user" ? (
                          detail?.nama_user === null ? (
                            <span>- (belum diverifikasi)</span>
                          ) : (
                            value
                          )
                        ) : (
                          value
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Modal>
      </div>
      {verifyRes && (
        <ConfirmationDialog
          message="Are you sure you want to verify this reservation?"
          onConfirm={handleVerify}
          onCancel={handleCancelVer}
          onReject={handleReject}
        />
      )}
      {openModalChangeStatus && (
        <ModalChangeStatus
          id={idTrans}
          onClose={onCloseModalChangeStatus}
          statusPem={statusPem}
        />
      )}
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Transaction Data</h1>
          <div className={styles.select_container2}>
            <div className={styles.select_wrap}>
              <Select
                options={filterOption}
                onChange={(e) => setKeyword(e.value)}
                styles={customStyles2}
                placeholder="Select by Status"
              />
            </div>
            <div>
              <input
                type="text"
                onChange={(e) => handleChangeName(e)}
                className={styles.input_name}
                placeholder="Search by Nama Tamu"
              />
            </div>
          </div>
          <div className={styles.input_container}>
            <label for="dateInput" className="date-input-label">
              Select by Tanggal Check in
            </label>
            <input
              type="date"
              id="dateInput"
              onChange={(e) => handleDateChange(e)}
              className={styles.input_date}
            />
          </div>
        </div>
        {error ? (
          <div style={{ textAlign: "center" }}>{errorMessage}</div>
        ) : (
          <>
            <div className={styles.table_wrapper}>
              <table className={styles.fl_table}>
                <thead>
                  <tr>
                    <th>Nama Tamu</th>
                    <th>Nomor Kamar</th>
                    <th>Status</th>
                    <th>Tgl Akses</th>
                    <th>Detail</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {check === false ? (
                    <tr>
                      <td colSpan={"7"} style={{ textAlign: "center" }}>
                        Nothing transaction to show
                      </td>
                    </tr>
                  ) : (
                    currentData.map((item, index) => (
                      <tr key={index}>
                        <td>{item?.nama_tamu}</td>
                        <td>
                          {item?.nomor_kamar.map((kamar, index) => (
                            <React.Fragment key={index}>
                              {kamar.nomor_kamar}
                              {index !== item.nomor_kamar.length - 1 && (
                                <span>, </span>
                              )}
                            </React.Fragment>
                          ))}
                        </td>

                        <td>{item?.status_pemesanan}</td>
                        <td>
                          {item?.tgl_check_in + " s/d " + item?.tgl_check_out}
                        </td>
                        <td>
                          <Button onClick={() => openModalDetail(item?.id)}>
                            Lihat Detail
                          </Button>
                        </td>
                        <td>
                          {item.nama_user === null ? (
                            <Button
                              onClick={() => openConfirmVer(item?.id)}
                              variant="outlined"
                              sx={{
                                margin: "0 0.5rem",
                                color: "#024f79",
                                borderColor: "#024f79",
                                "&:hover": {
                                  color: "#024f79",
                                  borderColor: "#024f79",
                                  backgroundColor: "#024f7911",
                                },
                              }}
                            >
                              verify
                            </Button>
                          ) : (
                            ""
                          )}
                          <Button
                            onClick={() =>
                              openEditModal(item?.id, item?.status_pemesanan)
                            }
                            variant="outlined"
                            sx={{
                              margin: "0 0.5rem",
                              color: "#024f79",
                              borderColor: "#024f79",
                              "&:hover": {
                                color: "#024f79",
                                borderColor: "#024f79",
                                backgroundColor: "#024f7911",
                              },
                            }}
                          >
                            change status
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className={styles.pagination_button}>
              {renderPageButtons()}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default withAuth(index);