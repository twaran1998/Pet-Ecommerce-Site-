import React from "react";
import { useState } from "react";
import { Grid, Select, MenuItem, Alert } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";


export default function PetTypeDdn(props) {
  const [petType, setpetType] = useState("");
  const isReadOnly = props.showUpdatebtn;

  const onPetChange = (e) => {
    if (!isReadOnly) {
      setpetType(e.target.value);
      props.callbackPetType(e.target.value);
    }
  };
  

  return (
    <>
      {/* <Grid container spacing={2} justifyContent="center" alignItems="center"> */}
      <Grid item lg={2} md={2} sm={2} xs={12}>
        <InputLabel className="labelLike">
          For Pet Type{" "}
          <sup>
            <strong>*</strong>
          </sup>
        </InputLabel>
      </Grid>
      <Grid item lg={3} md={2} sm={2} xs={12} sx={{ textAlign: "left"}}>
        <Select     
          onChange={onPetChange}
          className="textfield-spacing select-width myFullInputs myFullDdn"
          variant="outlined"
          name="categoryPet"
          // width="100%"
          displayEmpty={true}
          // Use the isReadOnly variable to determine whether the dropdown list should be read-only or not
          readOnly={isReadOnly}
          disabled={isReadOnly}
        >
          <InputLabel>Pet Type</InputLabel>
          <MenuItem value={"dog"}>Dog</MenuItem>
          <MenuItem value={"cat"}>Cat</MenuItem>
          <MenuItem value={"fish"}>Fish</MenuItem>
          <MenuItem value={"bird"}>Bird</MenuItem>
        </Select>
      </Grid>
      {/* </Grid> */}
    </>
  );
}
