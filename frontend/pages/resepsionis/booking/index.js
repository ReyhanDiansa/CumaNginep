import React, { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import styles from "../../../styles/BookingRes.module.css";
import Select from "react-select";
import dayjs from "dayjs";
import axios from "axios";
import Drawers from "react-drag-drawer";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";


let token = "";
let nama_user = "";
let config = {};
const index = () => {
  const [manual, setManual] = useState(false);
  const [automatic, setAutomatic] = useState(false);
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
    }else if(check_in && check_out && !tipe_kamar){
        getAvailableType();
    }
  }, [check_in, check_out, tipe_kamar]);
  useEffect(() => {
    console.log(nama_tipe);
  }, [nama_tipe]);

  const handleSubmit = async (e, p) => {
    e.preventDefault();
    if (p === "manual") {
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
        const sendData = await axios.post(
          "http://localhost:8000/pemesanan/manual",
          data,
          config
        );
        setResult(sendData.data.data[0]);
        console.log(sendData.data.data[0]);
        setTimeout(() => {
          setOpen(true);
        }, 2000);
      } catch (error) {
        setIsShow(true);
        setErrorMessage(error.response.data.message);
        console.log(error);
      }
    } else if (p === "auto") {
      const data = {
        nama_pemesanan: nama_pemesan,
        email_pemesanan: email,
        check_in: check_in,
        check_out: check_out,
        nama_tamu: nama_tamu,
        status: status,
        nama_user: nama_user,
        tipe_kamar: tipe_kamar,
      };
      try {
        const sendData = await axios.post(
          "http://localhost:8000/pemesanan",
          data,
          config
        );
        setResult(sendData.data.data[0]);
        console.log(sendData.data.data[0]);
        setTimeout(() => {
          setOpen(true);
        }, 2000);
      } catch (error) {
        setIsShow(true);
        setErrorMessage(error.response.data.message);
        console.log(error);
      }
    }
  };

  const optionsStatus = [
    { value: "Baru", label: "Baru" },
    { value: "CheckIn", label: "CheckIn" },
    { value: "CheckOut", label: "CheckOut" },
  ];

  const optionRoom = availableRoom.length > 0
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

  const optionType = availableType.length > 0 ? 
    availableType === "nothing type room available" ? (
        [{ label: "Tidak ada yang tersedia" }]
    ) : (
      availableType.map((item, index) => (
        {
            value: item.nama_tipe_kamar,
            label: item.nama_tipe_kamar,
          }
      ))
    )
   : (
    nama_tipe.map((item, index) => (
        {
            value: item.nama_tipe_kamar,
            label: item.nama_tipe_kamar,
          }
    ))
  );


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

  const manualHandle = () => {
    setManual(true);
    setAutomatic(false);
  };

  const automaticHandle = () => {
    setManual(false);
    setAutomatic(true);
  };

  const MyDrawer = () => {
    const toggle = () => {
      setOpen(!open);
    window.location.reload();

    };

    return (
      <Drawers open={open} onRequestClose={toggle}>
        <div style={{backgroundColor:"#fff",width:"20rem",textAlign:"center"}}>
          <h3>
            Berhasil Memesan
          </h3>
          <h4>Kamar</h4>
          <h1>{hasilInsert.nomor_kamar}</h1>
          <h5 style={{marginBottom:"1rem"}}>{hasilInsert.nama_tipe_kamar}</h5>
          <p>Lihat detail pesanan  di bagian transaksi</p>
          </div>
      </Drawers>
    );
  };

  const handleClose = () => {
    setIsShow(false);
  };

  return (
    <>
    <MyDrawer/>
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
        <div className={styles.option_container}>
          <button className={styles.button} onClick={manualHandle}>
            Manual Book
          </button>
          <button className={styles.button} onClick={automaticHandle}>
            Automatic Book
          </button>
        </div>
        {manual && (
          <>
            <div className={styles.form_container}>
              <div className={`${styles.form__group} ${styles.field}`}>
                <input
                  type="input"
                  className={styles.form__field}
                  placeholder="Nama Pemesan"
                  required=""
                  onChange={(e) => setNamaPemesan(e.target.value)}
                />
                <label for="name" className={styles.form__label}>
                  Nama Pemesan
                </label>
              </div>
              <div className={`${styles.form__group} ${styles.field}`}>
                <input
                  type="email"
                  className={styles.form__field}
                  placeholder="Email Pemesan"
                  required=""
                  onChange={(e) => setEmailPemesan(e.target.value)}
                />
                <label for="email" className={styles.form__label}>
                  Email Pemesan
                </label>
              </div>
              <div className={`${styles.form__group} ${styles.field}`}>
                <input
                  type="text"
                  className={styles.form__field}
                  placeholder="Nama Tamu"
                  required=""
                  onChange={(e) => setNamaTamu(e.target.value)}
                />
                <label for="nama_tamu" className={styles.form__label}>
                  Nama Tamu
                </label>
              </div>
              <div className={`${styles.form__group} ${styles.field}`}>
                <input
                  type="date"
                  className={styles.form__field}
                  placeholder="Tanggal CheckIn"
                  required=""
                  onChange={(e) => handleDateInChange(e.target.value)}
                />
                <label for="checkin" className={styles.form__label}>
                  Tanggal CheckIn
                </label>
              </div>
              <div className={`${styles.form__group} ${styles.field}`}>
                <input
                  type="date"
                  className={styles.form__field}
                  placeholder="Tanggal CheckOut"
                  required=""
                  onChange={(e) => handleDateOutChange(e.target.value)}
                />
                <label for="checkout" className={styles.form__label}>
                  Tanggal CheckOut
                </label>
              </div>
              <div className={styles.select}>
                <Select
                  id="my-select"
                  options={optionsStatus}
                  styles={customStyles}
                  placeholder="Status"
                  onChange={(e) => setStatus(e.value)}
                />
              </div>
              <div className={styles.select}>
                <Select
                  id="my-select"
                  options={optionType}
                  styles={customStyles}
                  placeholder="Tipe Kamar"
                  onChange={(e) => setTipeKamar(e.value)}
                />
              </div>
              <div className={styles.select}>
                <Select
                  id="my-select"
                  options={Array.isArray(optionRoom) ? optionRoom : []}
                  styles={customStyles}
                  onChange={(e) => setRoom(e.value)}
                  placeholder="Nomor Kamar"
                />
              </div>
              <br />
            </div>
            <div className={styles.button_container}>
              <button
                className={styles.buttonS}
                onClick={(e) => handleSubmit(e, "manual")}
              >
                <span className={styles.shadow}></span>
                <span class={styles.edge}></span>
                <span class={`${styles.front} ${styles.text}`}>Submit</span>
              </button>
            </div>
          </>
        )}
        {automatic && (
          <>
            <div className={styles.form_container}>
              <div className={`${styles.form__group} ${styles.field}`}>
                <input
                  type="input"
                  className={styles.form__field}
                  placeholder="Nama Pemesan"
                  required=""
                  onChange={(e) => setNamaPemesan(e.target.value)}
                />
                <label for="name" className={styles.form__label}>
                  Nama Pemesan
                </label>
              </div>
              <div className={`${styles.form__group} ${styles.field}`}>
                <input
                  type="email"
                  className={styles.form__field}
                  placeholder="Email Pemesan"
                  required=""
                  onChange={(e) => setEmailPemesan(e.target.value)}
                />
                <label for="email" className={styles.form__label}>
                  Email Pemesan
                </label>
              </div>
              <div className={`${styles.form__group} ${styles.field}`}>
                <input
                  type="text"
                  className={styles.form__field}
                  placeholder="Nama Tamu"
                  required=""
                  onChange={(e) => setNamaTamu(e.target.value)}
                />
                <label for="nama_tamu" className={styles.form__label}>
                  Nama Tamu
                </label>
              </div>
              <div className={`${styles.form__group} ${styles.field}`}>
                <input
                  type="date"
                  className={styles.form__field}
                  placeholder="Tanggal CheckIn"
                  required=""
                  onChange={(e) => handleDateInChange(e.target.value)}
                />
                <label for="checkin" className={styles.form__label}>
                  Tanggal CheckIn
                </label>
              </div>
              <div className={`${styles.form__group} ${styles.field}`}>
                <input
                  type="date"
                  className={styles.form__field}
                  placeholder="Tanggal CheckOut"
                  required=""
                  onChange={(e) => handleDateOutChange(e.target.value)}
                />
                <label for="checkout" className={styles.form__label}>
                  Tanggal CheckOut
                </label>
              </div>
              <div className={styles.select}>
                <Select
                  id="my-select"
                  options={optionsStatus}
                  styles={customStyles}
                  placeholder="Status"
                  onChange={(e) => setStatus(e.value)}
                />
              </div>
              <div className={styles.select}>
                <Select
                  id="my-select"
                  options={optionType}
                  styles={customStyles}
                  placeholder="Tipe Kamar"
                  onChange={(e) => setTipeKamar(e.value)}
                />
              </div>
              <br />
            </div>
            <div className={styles.button_container}>
              <button
                className={styles.buttonS}
                onClick={(e) => handleSubmit(e, "auto")}
              >
                <span className={styles.shadow}></span>
                <span class={styles.edge}></span>
                <span class={`${styles.front} ${styles.text}`}>Submit</span>
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default index;
