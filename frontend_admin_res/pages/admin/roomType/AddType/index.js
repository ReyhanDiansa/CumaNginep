import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import withAuth from "../../../withAuth";
import Drawer from "../../../../components/Drawer";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { TextField, Select, Button } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import Image from "next/image";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import axios from "axios"

import {  styled } from "@mui/material/styles";
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


let token = "";
let config = {};
const Index = () => {
  const [nama_tipe, setNama] = useState("");
  const [harga, setHarga] = useState(null);
  const [deskripsi, setDeskripsi] = useState("");
  const [foto, setFoto] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isShow, setIsShow] = useState(false);
  // const [error, setError] = useState(false);

  const router = useRouter();

  const saveFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFoto(file);
      setImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Append the form data
    formData.append("nama_tipe_kamar", nama_tipe);
    formData.append("harga", harga);
    formData.append("deskripsi", deskripsi);
    formData.append("foto", foto);

    try {
      await axios.post("http://localhost:8000/tipe", formData, config);

      // Update the data after successful form submission
      router.push("/admin/roomType");
    } catch (error) {
      console.log(error);
      setIsShow(true);
      setErrorMessage(error.response.data.message);
    }
  };

  const handleClose = () => {
    setIsShow(false);
  };
  useEffect(() => {
    token = window.localStorage.getItem("token");
    config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, []);
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

          <h1>Add Room Type</h1>
          <form onSubmit={handleSubmit}>
            <FormControl sx={{ m: 1, width: "40rem" }} variant="outlined">
              <CssTextField
                id="outlined-basic"
                label="Nama Tipe Kamar"
                variant="outlined"
                onChange={(e) => setNama(e.target.value)}
              />
            </FormControl>
            <FormControl sx={{ m: 1, width: "40rem" }} variant="outlined">
              <CssTextField
                id="outlined-basic"
                label="Harga"
                variant="outlined"
                type="number"
                onChange={(e) => setHarga(e.target.value)}
              />
            </FormControl>
            <FormControl sx={{ m: 1, width: "40rem" }} variant="outlined">
              <CssTextField
                id="outlined-basic"
                label="Deskripsi"
                multiline
                rows={4}
                variant="outlined"
                onChange={(e) => setDeskripsi(e.target.value)}
              />
            </FormControl>
           
            <br />
            <div style={{ margin: 1, width: "40rem", display: "flex" }}>
              <div>
                <Button
                  variant="outlined"
                  component="label"
                  sx={{
                    marginLeft: "0.5rem",
                    marginTop: "1rem",
                    // backgroundColor: "#024f79",
                    borderColor: "#024f79",
                    color: "#024f79",
                    ":hover": {
                      borderColor: "#024f79",
                      color: "#024f79",
                    },
                  }}
                >
                  Upload Foto
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={saveFile}
                  />
                </Button>
              </div>
              <div>
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="label"
                  sx={{
                    marginLeft: "0.5rem",
                    marginTop: "1rem",
                    // backgroundColor: "#024f79",
                    borderColor: "#024f79",
                    color: "#024f79",
                    ":hover": {
                      borderColor: "#024f79",
                      color: "#024f79",
                    },
                  }}
                >
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={saveFile}
                  />
                  <PhotoCamera />
                </IconButton>
              </div>
              <br />
              {/* <input type="file" onChange={saveFile} /> */}
            </div>
            <br />
            {imagePreview && (
              <div
                style={{
                  marginLeft: "0.5rem",
                  marginTop: "0.3rem",
                  display:"flex",
                  gap:"10px"
                }}
              >
                <div style={{marginTop:"2rem"}}>
                  <p>Preview:</p>
                </div>
                <Image
                  src={imagePreview}
                  alt="Selected Image"
                  width={100}
                  height={100}
                  style={{ aspectRatio: "3/2", objectFit: "contain" }}
                />
              </div>
            )}
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
