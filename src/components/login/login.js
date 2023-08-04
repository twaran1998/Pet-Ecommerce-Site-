import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import SuccessModal from "../common/modal";
// import swagimalsLogo from '../../'
const theme = createTheme();

export default function SignIn() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const closeModal = () => {
    setModalOpen(false);
  };

  const checkUser = async (userCred) => {
    try {
      let res = await fetch(`${process.env.REACT_APP_APIURL}/api/checkValidUser`, {
        method: "POST",
        headers: new Headers({ "content-type": "application/json" }),
        body: JSON.stringify({
          userData: userCred,
        }),
      });
      let resJson = await res.json();
      if (res.status === 200) {
        if (!resJson.user) {
          setModalTitle("User not found");
          setModalMessage("Login failed. Please try again carefully.");
          setModalOpen(true);
        } else {
          if (resJson.role == 1) {
            const loggedInUser = {
              isLoggedIn: true,
              username: resJson.fullName
            };

            const userObj = JSON.stringify(loggedInUser);
            sessionStorage.setItem("userData", userObj);

            setModalTitle("Login successful");
            setModalMessage("Hello Admin, You have successfully logged in!");
            setModalOpen(true);
          }
          else
          {
            setModalTitle("Login failed");
            setModalMessage("User not found");
            setModalOpen(true);
          }
        }
      } else {
        setModalTitle("Login failed");
        setModalMessage("User not found");
        setModalOpen(true);
      }
    } catch (err) {
      console.log("Failed to Login ", err);
    }
  };

  useEffect(() => {
    if (modalTitle === "Login successful" && modalOpen === false) {
      window.location.href = "/dashboard";
    }
  }, [modalTitle, modalOpen]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const user = {
      email: data.get("email"),
      password: data.get("userPswd"),
    };
    checkUser(user);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          {/* <img srcSet={process.env.PUBLIC_URL + "/swagimalsLogo.svg"}></img> */}
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="userPswd"
              label="Password"
              type="password"
              id="password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
            </Grid>
          </Box>
          -
        </Box>
        <SuccessModal
          open={modalOpen}
          handleClose={closeModal}
          title={modalTitle}
          message={modalMessage}
        />
      </Container>
    </ThemeProvider>
  );
}
