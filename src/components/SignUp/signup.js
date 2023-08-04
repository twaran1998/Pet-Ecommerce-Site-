import React, { useState } from "react";
import userModel from "../../models/userModel";
// import {Link} from 'react-router-dom';

import Button from "@mui/material/Button";

import TextField from "@mui/material/TextField";

import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";


const SignUp = () => {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSignup, setisSignup] = useState(false);


  async function addUser(userData) {
    try {
      let res = await fetch(`${process.env.REACT_APP_APIURL}/api/addUser`, {
        method: "POST",
        headers: new Headers({ "content-type": "application/json" }), //else will give reuest {} in server
        body: JSON.stringify({
          userData: userData,
        }),
      });
      let resJson = await res.json();
      if (res.status === 200) {
        console.log("user added");        
        alert('user added')
        setisSignup(true);
        window.location.href = "/login";
        
      } else {
        console.log("user not added");
        alert('user NOT added')
        setisSignup(false);
      }
    } catch (err) {
      console.log("Failed to add user ", err);
      setisSignup(false);
    }
  }
  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    // Log form data to console
    // console.log("Name: ", formData.get("fName"));
    const newUser = new userModel();
    newUser.firstName = formData.get("fName");
    newUser.lastName = formData.get("lName");
    newUser.email = formData.get("email");
    newUser.userPswd = formData.get("pswd");
    newUser.userRole = 2; //Customer = 2, admin = 1
    newUser.isUserActive = 1;
    console.log(JSON.stringify(newUser));

    addUser(newUser);

    // alert("Added");
  };

  return (
   <Container maxWidth="sm">
    <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
      {isSignup ? <Typography variant="h4">Signup Successful</Typography> : <Typography variant="h4">Signup failed</Typography>}
      <Box sx={{ mt: 8 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                name="fName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="password"
                label="Password"
                name="pswd"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 2 }}>
            <Button type="submit" fullWidth variant="contained" color="primary">
              Sign Up
            </Button>
          </Box>
          <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
            <Grid item>
              <Link href="#" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  
   
  );
};

export default SignUp;
