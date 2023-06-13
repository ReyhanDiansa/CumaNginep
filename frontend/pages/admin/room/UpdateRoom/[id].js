import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import withAuth from "../../../withAuth";
import Drawer from "../../../../components/Drawer";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import { TextField, Select, MenuItem, Button } from "@mui/material";
import { createMuiTheme } from "@mui/material/styles";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

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
let config = {};

const Index = () => {
  const [nomor_kamar, setNomor] = useState("");
  const [idTipe, setIdTipe] = useState("");
  const [tipe_kamar, setTipe] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isShow, setIsShow] = useState(false);
  const [nama_tipe_kamar, setNamaTipeKamar] = useState([]);

  const router = useRouter();

  const { id } = router.query;
  console.log(id);

  useEffect(() => {
    token = window.localStorage.getItem("token");
    config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, []);

  const getData = async () => {
    try {
      if (id) {
        const fetchData = await axios.get(
          `http://localhost:8000/kamar/findOneById/${id}`,
          config
        );
        console.log(fetchData.data.data);
        setNomor(fetchData.data.data[0].nomor_kamar);
        setIdTipe(fetchData.data.data[0].id_tipe_kamar);
      } else {
        console.log("id is undefined");
      }
    } catch (er) {
      setIsShow(true);
      setErrorMessage(er.response.data.message);
      console.log(er);
    }
  };

  const getType = async () => {
    try {
      const getDefaultType = await axios.get(
        `http://localhost:8000/tipe/findOneById/${idTipe}`,
        config
      );
      console.log(getDefaultType);
      setTipe(getDefaultType.data.data.nama_tipe_kamar);
      const fetchData = await axios.get(
        "http://localhost:8000/tipe/getAll",
        config
      );
      setNamaTipeKamar(fetchData.data.data);
    } catch (error) {
      console.log(error);
      setErrorMessage(error.response.data.message);

    }
  };
  useEffect(() => {
    getData();
  }, [id]);
  useEffect(() => {
    getType();
  }, [idTipe]);

  const handleClose = () => {
    setIsShow(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      nomor_kamar: nomor_kamar,
      nama_tipe_kamar: tipe_kamar,
    };

    try {
      await axios.put(`http://localhost:8000/kamar/${id}`,data, config);
      router.push("/admin/room");
    } catch (error) {
      setIsShow(true);
      setErrorMessage(error.response.data.message);
      console.log(error);
    }
  };

  return (
    <>
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
          <h1>Edit Room</h1>
          <form onSubmit={handleSubmit}>
            <FormControl sx={{ m: 1, width: "40rem" }} variant="outlined">
              <CssTextField
                id="outlined-basic"
                label="Nomor Kamar"
                variant="outlined"
                onChange={(e) => setNomor(e.target.value)}
                value={nomor_kamar}
              />
            </FormControl>

            <FormControl sx={{ m: 1, width: "40rem" }}>
              <CustomInputLabel htmlFor="outlined-adornment-role">
                Tipe Kamar
              </CustomInputLabel>
              <CustomSelect
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Tipe Kamar"
                onChange={(e) => setTipe(e.target.value)}
                value={tipe_kamar}
                input={<OutlinedInput label="Tipe Kamar" />}
              >
                {nama_tipe_kamar &&
                  nama_tipe_kamar.map((item, index) => (
                    <MenuItem value={item.nama_tipe_kamar} key={item.id}>
                      {item.nama_tipe_kamar}
                    </MenuItem>
                  ))}
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
              Edit
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default withAuth(Index);
