import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import withAuth from "../../../withAuth";
import Drawer from "../../../../components/Drawer";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import { TextField, Select, MenuItem, Button } from "@mui/material";
import { createMuiTheme, ThemeProvider } from "@mui/material/styles";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Drawers from "react-drag-drawer";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { makeStyles } from "@mui/styles";
const useStyles = makeStyles({
  root: {
    "& label.Mui-focused": {
      color: "#024f79",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#024f79",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "grey",
      },
      "&:hover fieldset": {
        borderColor: "#024f79",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#024f79",
      },
    },
  },
});

import { alpha, styled } from "@mui/material/styles";
const CssTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#024f79",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#024f79",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "grey",
    },
    "&:hover fieldset": {
      borderColor: "#024f79",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#024f79",
    },
  },
});

const CustomSelect = styled(Select)(({ theme }) => ({
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "gray", // Change this to your desired border color
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#024f79", // Change this to your desired hover border color
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#024f79", // Change this to your desired focused border color
  },
}));

const CustomInputLabel = styled(InputLabel)(({ theme }) => ({
  "&.Mui-focused": {
    color: "#024f79",
  },
}));

let token = "";
let nama_user = "";
let config = {};
const Index = () => {
  const classes = useStyles();

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

  const MyDrawer = () => {
    const toggle = () => {
      setOpen(!open);
    };

    return (
      <Drawers open={open} onRequestClose={toggle}>
        <div
          style={{
            backgroundColor: "#fff",
            width: "20rem",
            textAlign: "center",
          }}
        >
          <h3>Berhasil Memesan</h3>
          <h4>Kamar</h4>
          <h1>{hasilInsert.nomor_kamar}</h1>
          <h5 style={{ marginBottom: "1rem" }}>
            {hasilInsert.nama_tipe_kamar}
          </h5>
          <p>Lihat detail pesanan di bagian transaksi</p>
        </div>
      </Drawers>
    );
  };
  // const [error, setError] = useState(false);
  useEffect(() => {
    token = window.localStorage.getItem("token");
    nama_user = window.localStorage.getItem("nama_user");
    config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, []);
  const router = useRouter();

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

  useEffect(() => {
    getData();
    getDataRoom();
    if (check_in && check_out && tipe_kamar) {
      getAvailable();
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
  };
  // console.log(check_in);
  const handleClose = () => {
    setIsShow(false);
  };

  // console.log("ppp" + availableType);

  return (
    <>
      <MyDrawer />
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
      <div style={{ display: "flex" }}>
        <div>
          <Drawer />
        </div>
        <div style={{ margin: "2rem" }}>
          <form onSubmit={handleSubmit}>
            <FormControl sx={{ m: 1, width: "40rem" }} variant="outlined">
              <CssTextField
                id="outlined-basic"
                label="Nama Pemesan"
                variant="outlined"
                onChange={(e) => setNamaPemesan(e.target.value)}
              />
            </FormControl>
            <FormControl sx={{ m: 1, width: "40rem" }} variant="outlined">
              <CssTextField
                id="outlined-basic"
                label="Email Pemesan"
                variant="outlined"
                onChange={(e) => setEmailPemesan(e.target.value)}
              />
            </FormControl>
            <FormControl sx={{ m: 1, width: "40rem" }} variant="outlined">
              <CssTextField
                id="outlined-basic"
                label="Nama Tamu"
                variant="outlined"
                onChange={(e) => setNamaTamu(e.target.value)}
              />
            </FormControl>
            <FormControl sx={{ m: 1, width: "40rem" }} variant="outlined">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label="Tanggal CheckIn"
                  inputFormat="DD/MM/YYYY"
                  format="DD-MM-YYYY"
                  // value={value}
                  className={classes.root}
                  onChange={(e) => setCheckIn(dayjs(e).format("YYYY-MM-DD"))}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </FormControl>
            <FormControl sx={{ m: 1, width: "40rem" }} variant="outlined">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label="Tanggal CheckOut"
                  inputFormat="DD/MM/YYYY"
                  format="DD-MM-YYYY"
                  className={classes.root}
                  onChange={(e) => setCheckOut(dayjs(e).format("YYYY-MM-DD"))}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </FormControl>
            <FormControl sx={{ m: 1, width: "40rem" }}>
              <CustomInputLabel htmlFor="outlined-adornment-role">
                Status
              </CustomInputLabel>
              <CustomSelect
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Status"
                onChange={(e) => setStatus(e.target.value)}
                input={<OutlinedInput label="Status" />}
              >
                <MenuItem value="baru">Baru</MenuItem>
                <MenuItem value="checkin">CheckIn</MenuItem>
                <MenuItem value="checkout">CheckOut</MenuItem>
              </CustomSelect>
            </FormControl>
            <FormControl sx={{ m: 1, width: "40rem" }}>
              <CustomInputLabel htmlFor="outlined-adornment-role">
                Tipe Kamar
              </CustomInputLabel>
              <CustomSelect
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Tipe Kamar"
                onChange={(e) => setTipeKamar(e.target.value)}
                input={<OutlinedInput label="Tipe Kamar" />}
              >
                {nama_tipe.map((item, index) => (
                  <MenuItem value={item.nama_tipe_kamar} key={item.id}>
                    {item.nama_tipe_kamar}
                  </MenuItem>
                ))}
              </CustomSelect>
            </FormControl>
            <FormControl sx={{ m: 1, width: "40rem" }}>
              <CustomInputLabel htmlFor="outlined-adornment-role">
                Nomor Kamar
              </CustomInputLabel>
              <CustomSelect
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Tipe Kamar"
                onChange={(e) => setRoom(e.target.value)}
                input={<OutlinedInput label="Tipe Kamar" />}
              >
                {availableRoom.length > 0 ? (
                  availableRoom === "nothing type room available" ? (
                    <MenuItem>Tidak ada yang tersedia </MenuItem>
                  ) : (
                    availableRoom.map((item, index) => (
                      <MenuItem value={item.nomor_kamar} key={item.id}>
                        {item.nomor_kamar}
                      </MenuItem>
                    ))
                  )
                ) : (
                  allRoom.map((item, index) => (
                    <MenuItem value={item.nomor_kamar} key={item.id}>
                      {item.nomor_kamar}
                    </MenuItem>
                  ))
                )}
              </CustomSelect>
            </FormControl>
            <br />
            <Button
              type="submit"
              variant="contained"
              sx={{
                marginLeft: "0.5rem",
                marginTop: "1rem",
                backgroundColor: "#024f79",
                color: "white",
                ":hover": {
                  backgroundColor: "#024f79",
                },
              }}
            >
              Add
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default withAuth(Index);
