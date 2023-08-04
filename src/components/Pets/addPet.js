import { Component } from "react";
import "./addPet.css";
import { DataGrid } from "@mui/x-data-grid";
import {
  TextField,
  Button,
  Input,
  InputAdornment,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateIcon from "@mui/icons-material/Update";
import { Grid, Select, MenuItem, Alert } from "@mui/material";
import { Form } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import { red } from "@mui/material/colors";
import PetTypeDdn from "../common/petTypeDdn";
import SuccessModal from "../common/modal";
import { verifyFileFormat } from "../../utilityFn/verifyFileFormat";

export default class PetForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // petName: "",
      petPrice: "",
      petBreed: "",
      petImage: "",
      petRating: "",
      pets: [],
      isMobile: window.innerWidth <= 600,
      petType: "",
      serviceUpdated: false,
      serviceDeleted: false,
      serviceAdded: false,
      modalOpen: false,
    };

    this.handleAddPet = this.handleAddPet.bind(this);
    // this.onPetNameChange = this.onPetNameChange.bind(this);
    this.onPriceChange = this.onPriceChange.bind(this);
    this.onBreedChange = this.onBreedChange.bind(this);
    this.onPetImageChange = this.onPetImageChange.bind(this);
    this.onRatingChange = this.onRatingChange.bind(this);
    this.handleDeletePet = this.handleDeletePet.bind(this);
    this.onPetTypeChange = this.onPetTypeChange.bind(this);
    this.handleUpdatePet = this.handleUpdatePet.bind(this);
    this.onModalClose = this.onModalClose.bind(this);
  }

  onModalClose() {
    this.setState({ modalOpen: false ,
      serviceAdded: false,
      serviceUpdated: false,
      serviceDeleted: false,});
  }
  onPetTypeChange(selected) {
    this.setState({ petType: selected });
  }

  onPetNameChange(e) {
    this.setState({ petName: e.target.value });
  }
  onPriceChange(e) {
    this.setState({ petPrice: e.target.value });
  }
  onBreedChange(e) {
    this.setState({ petBreed: e.target.value });
  }

  onPetImageChange(e) {
    // this.setState({ petImage: e.target.value });
    const selectedFile = e.target.files[0];

    if (verifyFileFormat(selectedFile)) {
      this.setState({ petImage: selectedFile });
    } else {
      alert("Unsupported file type. \nChoose .jpeg, .jpg, .webp or .png only");
      this.setState({ petImage: "" });
    }
  }

  onRatingChange(e) {
    this.setState({ petRating: e.target.value });
  }
  handleWindowResize = () => {
    this.setState({ isMobile: window.innerWidth <= 600 });
  };

  getRowsForView(isMobile) {
    const rows = this.state.pets.map((pet) => {
      if (isMobile) {
        return [
          {
            id: pet._id + "_petType",
            info: "Pet Type",
            value: pet.petType,
          },
          
          {
            id: pet._id + "_categoryImage",
            info: "Pet Image",
            value: pet.imageUrl,
          },
         
          {
            id: pet._id + "_delete",
            info: "Delete",
            value: (
              <IconButton
                color='secondary'
                onClick={() => this.handleDeletePet(pet._id)}
              >
                <DeleteIcon />
              </IconButton>
            ),
          },
          {
            id: pet._id + "_update",
            info: "Update",
            value: (
              <IconButton
                color='secondary'
                onClick={() => this.handleUpdatePet(pet._id)}
              >
                <UpdateIcon />
              </IconButton>
            ),
          },
        ];
      } else {
        return {
          id: pet._id,
          petType: pet.petType,
          petImage: pet.imageUrl,
          
        };
      }
    });

    return isMobile ? rows.flat() : rows;
  }

  async handleAddPet(e) {
    e.preventDefault();

    if (this.state.showUpdatebtn) {
      const formData = new FormData();

      // formData.append("petPrice", this.state.petPrice);
      // formData.append("petBreed", this.state.petBreed);
      formData.append("petImage", this.state.petImage);
      // formData.append("petRating", this.state.petRating);
      formData.append("petType", this.state.petType);
      formData.append("petId", this.state.petId);

      try {
        let res = await fetch(`${this.props.apiUrl}/api/addPet`, {
          method: "POST",
          body: formData,
          "Content-Type": "multipart/form-data",
        })
          .then((resp) => {
            // console.log("category added");
            if (resp.status === 201) {
              this.setState({
                serviceUpdated: true,
                modalOpen: true,
                petImage: "",
                petType: "",
              });
              this.formElement.reset();
              this.fetchPets();
            } else {
              console.log("Pet not added");
            }
          })
          .catch((err) => {
            console.log("Not added Pet", err);
          });
      } catch (err) {
        console.log(err);
      }
      this.setState({ showUpdatebtn: false });
    } else {
      const formData = new FormData();

      formData.append("petPrice", this.state.petPrice);
      // formData.append("petBreed", this.state.petBreed);
      formData.append("petImage", this.state.petImage);
      // formData.append("petRating", this.state.petRating);
      formData.append("petType", this.state.petType);

      try {
        let res = await fetch(`${this.props.apiUrl}/api/addPet`, {
          method: "POST",
          body: formData,
          "Content-Type": "multipart/form-data",
        })
          .then((resp) => {
            // console.log("category added");
            if (resp.status === 201) {
              // console.log("pet added");
              this.setState({
                serviceAdded: true,
                modalOpen: true,
                petImage: "",
                petType: "",
              });
              this.formElement.reset();
              this.fetchPets();
            } else {
              console.log("Pet not added");
            }
          })
          .catch((err) => {
            console.log("Not added pet ", err);
          });
      } catch (err) {
        console.log(err);
      }
    }
  }
  async fetchPets() {
    try {
      let res = await fetch(`${this.props.apiUrl}/api/pets`, {
        method: "GET",
        headers: new Headers({ "content-type": "application/json" }),
      });
      let resJson = await res.json();
      console.log("FETCHED PETS", resJson);
      if (res.status === 200) {
        // this.setState({ categories: resJson });
        let petList = resJson.map((pet, index) => {
          //to remove uploads or public in image path beginning
          const url = `${pet.petImage.path}`.slice(7);

          const imgPath = `${this.props.apiUrl}/${url}`;
          // console.log(`image url for ${index}`, imgPath);
          let petWithImage = { ...resJson[index], imageUrl: imgPath };
          return petWithImage;
        });

        // console.log("FETCHED categorries image ", petList);

        this.setState({ pets: petList });
        // console.log("UPDATED PETS", this.state.pets);
      } else {
        console.log("PETS not fetched");
      }
    } catch (err) {
      console.log(err);
    }
  }
  async handleUpdatePet(id) {
    debugger;
    let res = await fetch(`${this.props.apiUrl}/api/formPet/${id}`, {
      method: "GET",
      headers: new Headers({ "content-type": "application/json" }),
    });
    let resJson = await res.json();
    console.log("Fetch pet service on uhpload buttino click ", resJson);
    if (res.status === 200) {
      this.setState({
        petImage: resJson.petImage,
        petType: resJson.petType,

        petId: resJson._id,

        showUpdatebtn: true,
      });
    } else console.log("pet not fetched");
  }
  catch(err) {
    console.log(err);
  }
  async handleDeletePet(id) {
    try {
      let res = await fetch(`${this.props.apiUrl}/api/deletePet/${id}`, {
        method: "DELETE",
        headers: new Headers({ "content-type": "application/json" }),
      });
      let resJson = await res.json();
      if (res.status === 200) {
        this.setState({
          serviceDeleted: true,
          modalOpen: true,
        });
        this.fetchPets();
      } else {
        console.log("pet not deleted");
      }
    } catch (err) {
      console.log(err);
    }
  }
  componentDidMount() {
    this.fetchPets();
    window.addEventListener("resize", this.handleWindowResize);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
  }
  render() {
    const columns = this.state.isMobile
    ? [
        { field: "info", headerName: "Info", flex: 1 },
        {
          field: "value",
          headerName: "Value",
          flex: 1,
          renderCell: (params) => {
            if (params.row.info === "Actions") {
              return params.row.value;
            }
            if (params.row.info === "Pet Image") {
              return (
                <a href={params.value} rel='noreferrer' target='_blank'>
                  <img
                    src={params.value} alt={params.value}
                    style={{ height: 100, width: 50 }}
                  />
                </a>
              );
            }
            return params.value;
          },
        },
      ]
    : [
      // { field: "petName", headerName: "Pet Name", flex: 1 },
      { field: "petType", headerName: "Pet Type", flex: 1 },

      // { field: "petBreed", headerName: "Pet Breed", flex: 1 },
      {
        field: "petImage",
        headerName: "Pet Image",
        flex: 1,
        renderCell: (params) => (
          <a href={params.value} rel='noreferrer' target='_blank'>
            <img src={params.value} alt={params.value} style={{ height: 100, width: 50,objectFit:'contain' }} />
          </a>
        ),
      },
      // { field: "petRating", headerName: "Pet Rating", flex: 1 },
      {
        field: "delete",
        headerName: "Delete",
        width: 100,
        renderCell: (params) => (
          <IconButton
            color='secondary'
            onClick={() => this.handleDeletePet(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        ),
      },
      {
        field: "update",
        headerName: "Update",
        width: 100,
        renderCell: (params) => (
          <IconButton
            color='secondary'
            onClick={() => this.handleUpdatePet(params.row.id)}
          >
            <UpdateIcon />
          </IconButton>
        ),
      },
    ];
    const rows = this.state.isMobile
      ? this.getRowsForView(true).flat() // Transform rows for mobile view and flatten the array
      : this.getRowsForView(false); // Transform rows for desktop view

    return (
      <div className="container">
        <form ref={form => this.formElement = form} onSubmit={this.handleAddPet}  className='myFormPad'>
          <h1 className="Title">Pet</h1>
          <h5>Purpose - For pets on UI</h5>
          <Grid
            container
            spacing={2}
            justifyContent='center'
            alignItems='center'
          >
            <PetTypeDdn callbackPetType={this.onPetTypeChange}></PetTypeDdn>

            <Grid item lg={2} md={2} sm={2} xs={12}>
              <InputLabel className='labelLike'>
                Upload Pet Image{" "}
                <sup>
                  <strong>*</strong>
                </sup>
              </InputLabel>
            </Grid>
            <Grid item lg={3} md={2} sm={2} xs={12} sx={{ textAlign: "left" }}>
              <TextField
                // style={{ marginTop: "5px", marginBottom: "10px", width: "56%" }}
                className="myFullInputs"
                accept="image/*"
                name="categoryImage"
                type="file"
                onChange={this.onPetImageChange}
                required
              />
            </Grid>
          </Grid>
          {!this.state.showUpdatebtn ? (
            <Button
              className='textfield-spacing'
              type='submit'
              variant='contained'
              color='primary'
            >
              Add Pet
            </Button>
          ) : (
            <Button
              className='textfield-spacing'
              type='submit'
              variant='contained'
              color='primary'
            >
              Update Pet
            </Button>
          )}
          <br></br>
          {this.state.serviceAdded && (
            <SuccessModal
              open={this.state.modalOpen}
              handleClose={this.onModalClose}
              title='Pet added successfully!'
              message='The Pet details you have entered have been accepted and stored in the records accordingly.
          This window will close within 5 seconds'
            />
          )}
          {this.state.serviceUpdated && (
            <SuccessModal
              open={this.state.modalOpen}
              handleClose={this.onModalClose}
              title='Pet Updated successfully!'
              message='The Pet details you have updated have been stored in the records accordingly. 
          This window will close within 5 seconds'
            />
          )}
          {this.state.serviceDeleted && (
            <SuccessModal
              open={this.state.modalOpen}
              handleClose={this.onModalClose}
              title='Pet Deleted successfully!'
              message='The Pet record you chose has been deleted successfully from our records.
          This window will close within 5 seconds'
            />
          )}
        </form>
       <div className='dataGridContainer'>
          {this.state.pets.length > 0 ? (
            <DataGrid
              className='my-data-grid'
              rows={rows}
              // rowCount = {this.state.isMobile ? (rows.length / 4) : rows.length}
              columns={columns}
              pageSize={this.state.isMobile ? 4 : 5}

              // checkboxSelection
            />
          ) : this.state.pets.length === 0 ? (
            <p>No pets found</p>
          ) : (
            <p>Loading data...</p>
          )}
        </div>
      </div>
    );
  }
}
