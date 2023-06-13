import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../../styles/TransactionRes.module.css";
import Navbar from "../../../components/Navbar";
import { Button } from "@mui/material";
import Modal from "react-modal";
import { AiOutlineClose } from "react-icons/ai";
import Link from "next/link";
import { useRouter } from "next/router";
import ConfirmationDialog from "../../../components/PopUpConfirm";
import Select from "react-select";

let token = "";
let config = {};
export default function index() {
  const pageSize = 10; // number of items to display per page
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [detail, setDetail] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [idRoom, setIdRoom] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isShow, setIsShow] = useState(false);
  const [error, setError] = useState(false);
  const [keyword, setKeyword] = useState(null);
  const [check, setCheck] = useState(false);

  const router = useRouter();

  useEffect(() => {
    token = window.localStorage.getItem("token");
    config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, []);

  const fetchData = async () => {
    try {
      let response;
      if (keyword === null || keyword === "null") {
        response = await axios.get(
          "http://localhost:8000/pemesanan/getAll",
          config
        );
      } else {
        response = await axios.post(
          "http://localhost:8000/pemesanan/findOne",
          { status: keyword },
          config
        );
      }
      console.log(response);
      let responseData = response.data.data;
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
      setErrorMessage(error.response.data.message);
      setError(true);
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [keyword]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
    { value: "null", label: "All" },
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
      console.log(fetchData.data.data);
      setDetail(fetchData.data.data);
      setOpenModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  function closeModal() {
    setOpenModal(false);
  }

  const handleConfirm = async () => {
    try {
      const getData = await axios.delete(
        `http://localhost:8000/pemesanan/${idRoom}`,
        config
      );
      setShowConfirmation(false);
      window.location.reload();
    } catch (error) {
      setIsShow(true);
      setErrorMessage(error.response.data.message);
      setError(true);
    }
  };

  const handleCancel = async () => {
    setShowConfirmation(false);
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
                      <td>: {value}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Modal>
      </div>
      {showConfirmation && (
        <ConfirmationDialog
          message="Are you sure you want to delete this item?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Transaction Data</h1>
          <div className={styles.select_container2}>
          <Select
            options={filterOption}
            onChange={(e) => setKeyword(e.value)}
            styles={customStyles2}
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
                    <th>Nota Transaksi</th>
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
                        <td>{item?.nomor_kamar}</td>
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
                          <Button
                            onClick={() =>
                              router.push(
                                `/resepsionis/NotaTransaksi/${item?.id}`
                              )
                            }
                          >
                            Lihat Nota
                          </Button>
                        </td>
                        <td>
                          <Button
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
                            <Link
                              href={`/resepsionis/EditTransaction/${item?.id}`}
                            >
                              edit
                            </Link>
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleClick(item?.id)}
                          >
                            hapus
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
