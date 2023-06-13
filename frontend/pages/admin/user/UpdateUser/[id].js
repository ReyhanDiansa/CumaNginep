import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { useRouter } from "next/router";
import withAuth from "../../../withAuth";
import Drawer from "../../../../components/Drawer";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { TextField, Select, MenuItem, Button } from "@mui/material";
import { createMuiTheme, ThemeProvider } from "@mui/material/styles";
import Image from "next/image";
import axios from "axios";
import ReverseMd5 from "reverse-md5";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

let rev = ReverseMd5({
  lettersUpper: false,
  lettersLower: true,
  numbers: true,
  special: false,
  whitespace: true,
  maxLen: 12,
});

import { styled } from "@mui/material/styles";
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
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#024f79",
    },
  },
  overrides: {
    MuiOutlinedInput: {
      root: {
        "& label.Mui-focused": {
          color: "#024f79",
        },
        "& .MuiInput-underline:after": {
          borderBottomColor: "#024f79",
        },
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "black",
          },
          "&:hover fieldset": {
            borderColor: "#024f79",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#024f79",
          },
        },
        notchedOutline: {},
      },
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
  const [showPassword, setShowPassword] = useState(false);
  const [nama_user, setNama] = useState("");
  const [foto, setFoto] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isShow, setIsShow] = useState(false);
  const [ImageBef, setImageBef] = useState(false)


  const router = useRouter();

  const saveFile = (e) => {
    setImageBef(false)
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

  const { id } = router.query;
  const getData = async () => {
    try {
      const item = await axios.get(
        `http://localhost:8000/user/findOne/${id}`,
        config
      );
      console.log(item);
      setNama(item.data.data.nama_user);
      setFoto(item.data.data.foto);
      // setImagePreview(item.data.data.foto)
      setEmail(item.data.data.email);
      setPassword(rev(item.data.data.password).str);
      setRole(item.data.data.role);
      // console.log(item.data.data.nama_user);
      console.log(nama_user);
      setImageBef(true)

    } catch (er) {
      setIsShow(true);
      setErrorMessage(er.response.data.message);
      console.log(er);
    }
  };

  useEffect(() => {
    token = window.localStorage.getItem("token");
    config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    getData();
  }, [id]);

  const handleClose = () => {
    setIsShow(false);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Append the form data
    formData.append("nama_user", nama_user);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", role);
    formData.append("foto", foto);

    try {
      await axios.put(`http://localhost:8000/user/${id}`, formData);
      router.push("/admin/user");
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
          <h1>Add User</h1>
          <form onSubmit={handleSubmit}>
            <FormControl sx={{ m: 1, width: "40rem" }} variant="outlined">
              <CssTextField
                id="outlined-basic"
                label="Nama"
                variant="outlined"
                value={nama_user}
                onChange={(e) => setNama(e.target.value)}
              />
            </FormControl>
            <FormControl sx={{ m: 1, width: "40rem" }} variant="outlined">
              <CssTextField
                id="outlined-basic"
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl sx={{ m: 1, width: "40rem" }} variant="outlined">
              <ThemeProvider theme={theme}>
                <InputLabel htmlFor="outlined-adornment-password">
                  Password
                </InputLabel>

                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  value={password}
                  label="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </ThemeProvider>
            </FormControl>
            <FormControl sx={{ m: 1, width: "40rem" }}>
              <CustomInputLabel htmlFor="outlined-adornment-role">
                Role
              </CustomInputLabel>
              <CustomSelect
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Role"
                onChange={(e) => setRole(e.target.value)}
                value={role}
                input={<OutlinedInput label="Role" />}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="resepsionis">Resepsionis</MenuItem>
              </CustomSelect>
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
                    // backgroundColor: "#311b92",
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
                    // backgroundColor: "#311b92",
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
            {imagePreview ? (
              <div
                style={{
                  marginLeft: "0.5rem",
                  marginTop: "0.3rem",
                  display: "flex",
                  gap: "10px",
                }}
              >
                <div style={{ marginTop: "2rem" }}>
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
            ):(
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
                  src={`http://localhost:8000/foto_user/${foto}`}
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
              Edit
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default withAuth(Index);
