import React, { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import styles from "../../../styles/BookingRes.module.css";
import Select from "react-select";
import dayjs from "dayjs";
import axios from "axios";
import Drawers from "react-drag-drawer";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useRouter } from "next/router";

let token = "";
let nama_user = "";
let config = {};
const index = () => {
  const [nama_pemesan, setNamaPemesan] = useState("");
  const [email, setEmailPemesan] = useState("");
  const [check_in, setCheckIn] = useState("");
  const [check_out, setCheckOut] = useState("");
  const [nama_tamu, setNamaTamu] = useState("");
  const [status, setStatus] = useState("");
  const [tipe_kamar, setTipeKamar] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isShow, setIsShow] = useState(false);
  const [nama_tipe, setNamaTipeKamar] = useState([]);
  const [open, setOpen] = useState(false);
  const [availableRoom, setAvailableRoom] = useState([]);
  const [hasilInsert, setResult] = useState([]);
  const [nomor_kamar, setRoom] = useState("");
  const [allRoom, setAllRoom] = useState([]);
  const [availableType, setAvailableType] = useState([]);

  const router = useRouter();
  const { id } = router.query;
  const findData = async () => {
    try {
      const fetchData = await axios.post(
        "http://localhost:8000/pemesanan/findOne",
        { id },
        config
      );
      console.log(fetchData.data.data);
      setNamaPemesan(fetchData.data.data.nama_pemesanan);
      setEmailPemesan(fetchData.data.data.email_pemesanan);
      setCheckIn(dayjs(fetchData.data.data.tgl_check_in).format("YYYY-MM-DD"));
      setCheckOut(
        dayjs(fetchData.data.data.tgl_check_out).format("YYYY-MM-DD")
      );
      setNamaTamu(fetchData.data.data.nama_tamu);
      setStatus(fetchData.data.data.status_pemesanan);
      setTipeKamar(fetchData.data.data.nama_tipe_kamar);
      setRoom(fetchData.data.data.nomor_kamar);
      console.log(check_in);
    } catch (error) {
      console.log(error);
    }
  };

  const defaultValue = [
    { value: status, label: status },
    { value: nomor_kamar, label: nomor_kamar },
    { value: tipe_kamar, label: tipe_kamar },
  ];

  const handleDateInChange = (e) => {
    const selectedDate = dayjs(e).format("YYYY-MM-DD");
    setCheckIn(selectedDate);
  };
  const handleDateOutChange = (e) => {
    const selectedDate = dayjs(e).format("YYYY-MM-DD");
    setCheckOut(selectedDate);
  };

  useEffect(() => {
    token = window.localStorage.getItem("token");
    nama_user = window.localStorage.getItem("nama_user");
    config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, []);
  
  useEffect(()=>{
    findData()
  },[id])

  const getData = async () => {
    try {
      const fetchData = await axios.get(
        "http://localhost:8000/tipe/getAll",
        config
      );
      setNamaTipeKamar(fetchData.data.data);
      // Update the data after successful form submission
    } catch (error) {
      setIsShow(true);
      // setErrorMessage(error.response.data.message);
      console.log(error);
    }
  };

  const getDataRoom = async () => {
    try {
      const fetchData = await axios.get(
        "http://localhost:8000/kamar/getAll",
        config
      );
      setAllRoom(fetchData.data.data);
      // Update the data after successful form submission
    } catch (error) {
      setIsShow(true);
      // setErrorMessage(error.response.data.message);
      console.log(error);
    }
  };

  const getAvailable = async () => {
    try {
      const fetchData = await axios.post(
        "http://localhost:8000/kamar/getAvailableWType",
        { nama_tipe: tipe_kamar, check_in, check_out },
        config
      );
      setAvailableRoom(fetchData.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAvailableType = async () => {
    try {
      const fetchData = await axios.post(
        "http://localhost:8000/tipe/getAvailableTypeRoom",
        { check_in, check_out },
        config
      );
      setAvailableType(fetchData.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
    getDataRoom();
    if (check_in && check_out && tipe_kamar) {
      getAvailable();
    } else if (check_in && check_out && !tipe_kamar) {
      getAvailableType();
    }
  }, [check_in, check_out, tipe_kamar]);
  useEffect(() => {
    console.log(nama_tipe);
  }, [nama_tipe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      nama_pemesanan: nama_pemesan,
      email_pemesanan: email,
      check_in: check_in,
      check_out: check_out,
      nama_tamu: nama_tamu,
      status: status,
      nama_user: nama_user,
      nomor_kamar: nomor_kamar,
      tipe_kamar: tipe_kamar,
    };
    try {
      const sendData = await axios.put(
        `http://localhost:8000/pemesanan/${id}`,
        data,
        config
      );
      // setResult(sendData.data.data[0]);
      // console.log(sendData.data.data[0]);
      // setTimeout(() => {
      //   setOpen(true);
      // }, 2000);\
      router.push("/resepsionis/transaction");
    } catch (error) {
      setIsShow(true);
      setErrorMessage(error.response.data.message);
      console.log(error);
    }
  };

  const optionsStatus = [
    { value: "Baru", label: "Baru" },
    { value: "CheckIn", label: "CheckIn" },
    { value: "CheckOut", label: "CheckOut" },
  ];

  const optionRoom =
    availableRoom.length > 0
      ? availableRoom === "nothing type room available"
        ? [{ label: "Tidak ada yang tersedia" }]
        : availableRoom.map((item, index) => ({
            value: item.nomor_kamar,
            label: item.nomor_kamar,
          }))
      : allRoom.map((item, index) => ({
          value: item.nomor_kamar,
          label: item.nomor_kamar,
        }));

  const optionType =
    availableType.length > 0
      ? availableType === "nothing type room available"
        ? [{ label: "Tidak ada yang tersedia" }]
        : availableType.map((item, index) => ({
            value: item.nama_tipe_kamar,
            label: item.nama_tipe_kamar,
          }))
      : nama_tipe.map((item, index) => ({
          value: item.nama_tipe_kamar,
          label: item.nama_tipe_kamar,
        }));

  const customStyles = {
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
      backgroundColor: "#e8e8f0",
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

  const handleClose = () => {
    setIsShow(false);
  };

  return (
    <>
      {/* <MyDrawer /> */}
      <Snackbar open={isShow} autoHideDuration={6000} onClose={handleClose}>
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleClose}
          severity="error"
        >
          {errorMessage}
        </MuiAlert>
      </Snackbar>
      <div>
        <Navbar />
      </div>
      <div>
        <>
          <div className={styles.form_container2}>
            <div className={styles.select}>
              <Select
                id="my-select"
                options={optionsStatus}
                styles={customStyles}
                placeholder="Status"
                value={defaultValue[0]}
                onChange={(e) => setStatus(e.value)}
              />
            </div>
            <br />
          </div>
          <div className={styles.button_container}>
            <button className={styles.buttonS} onClick={handleSubmit}>
              <span className={styles.shadow}></span>
              <span class={styles.edge}></span>
              <span class={`${styles.front} ${styles.text}`}>Edit</span>
            </button>
          </div>
        </>
      </div>
    </>
  );
};

export default index;
