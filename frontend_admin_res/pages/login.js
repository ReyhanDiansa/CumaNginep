import { useState } from "react";
import { useRouter } from "next/router";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { deepPurple } from "@mui/material/colors";
import withAuth from "./withAuth";


const theme = createTheme({
  palette: {
    primary: {
      main: deepPurple[900],
    },
    secondary:{
      main: "#F1EEFF"
    }
  },
});

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="">
        CumaNginep
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// const theme = createTheme();
function SignInSide() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorAlert, setErrorAlert]=useState(false);
  const [message,setMessage]=useState("")
  const router = useRouter();

  
  const handleSubmit = async (event) => {
    event.preventDefault();
    const res = await fetch("http://localhost:8000/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      const result = await res.json();
      //   console.log(result);
      localStorage.setItem("token", result.data.token);
      localStorage.setItem("nama_user", result.data.nama_user);
      localStorage.setItem("role", result.data.role);
      if (result.data.role === "admin") {
        router.push("/admin");
      } else if (result.data.role === "resepsionis") {
        router.push("/resepsionis");
      }
    } else {
      console.error("Login failed");
      const result = await res.json();
      setMessage(result.message);
      setErrorAlert(true)
    }
  };
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: "url(hotel.jpg)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 12,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 2, mx:"50%" }}
            >
              <FormControl sx={{ width: "30rem" }} variant="outlined">
                <TextField
                  id="outlined-basic"
                  label="Email"
                  variant="outlined"
                  color="primary"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <br />
              <br />
              <FormControl
                sx={{ width: "30rem", margin: "auto" }}
                variant="outlined"
              >
                <InputLabel
                  htmlFor="outlined-adornment-password"
                  color="primary"
                >
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
                  label="Password"
                  color="primary"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              {
                errorAlert &&
                <div style={{color:"red"}}>{message}</div>
              }
              <Button
                type="submit"
                fullWidth
                variant="outlined"
                sx={{
                  mt: 3,
                  mb: 2,
                  color: "primary.main",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderColor:"primary.main",
                  transition: "background-color 0.3s ease-out, color 0.3s ease-out",
                  "&:hover": {
                    color: "primary.main",
                    borderColor:"primary.main",
                    backgroundColor: "secondary.main",
                  },
                }}
              >
                Sign In
              </Button>

              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default withAuth(SignInSide);
