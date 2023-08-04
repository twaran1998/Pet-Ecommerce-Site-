import { Component } from "react";
import "./addservice.css";
import { DataGrid } from "@mui/x-data-grid";
import SuccessModal from "../common/modal";
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

import { verifyFileFormat } from "../../utilityFn/verifyFileFormat";

export default class Services extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceName: "",
      serviceType: "",
      description: "",
      serviceImg: "",
      serviceAdded: false,
      isMobile: window.innerWidth <= 600,
      services: [],
      serviceNameError: "",
      serviceDescError: "",
      showUpdatebtn: false,
      serviceUpdated: false,
      serviceDeleted: false,
    };
    this.handleAddService = this.handleAddService.bind(this);
    this.onServiceNameChange = this.onServiceNameChange.bind(this);
    this.onServiceTypeChange = this.onServiceTypeChange.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
    this.onServiceImgChange = this.onServiceImgChange.bind(this);
    this.handleUpdateService = this.handleUpdateService.bind(this);
    this.handleDeleteService = this.handleDeleteService.bind(this);
    this.onModalClose = this.onModalClose.bind(this);
  }

  onServiceNameChange(e) {
    const regex = /^[a-zA-Z\s]*$/;
    const value = e.target.value.trim(); // Remove leading/trailing spaces
    const hasSpecialChar = /[^\w\s]/.test(value); // Check for special characters
    const hasDigit = /\d/.test(value); // Check for digits
    if (regex.test(value)) {
      this.setState({ serviceName: value, serviceNameError: "" });
    } else if (hasSpecialChar && hasDigit) {
      this.setState({
        serviceName: value,
        serviceNameError: "Service Name should only contain letters and spaces",
      });
    } else if (hasSpecialChar) {
      this.setState({
        serviceName: value,
        serviceNameError: "Service Name should not contain special characters",
      });
    } else if (hasDigit) {
      this.setState({
        serviceName: value,
        serviceNameError: "Service Name should not contain digits",
      });
    } else {
      this.setState({
        serviceName: value,
        serviceNameError: "Service Name can't be empty",
      });
    }
  }

  onModalClose() {
    this.setState({
      modalOpen: false,
      serviceAdded: false,
      serviceUpdated: false,
      serviceDeleted: false,
    });
  }
  onServiceTypeChange(e) {
    this.setState({ serviceType: e.target.value });
  }

  onDescriptionChange(e) {
    const regex = /^(?!\s*$).+/;
    const isValid = regex.test(e.target.value);
    if (isValid) {
      this.setState({
        description: e.target.value,
        serviceDescError: "",
      });
    } else {
      this.setState({
        description: e.target.value,
        serviceDescError: "Service Description can't be empty",
      });
    }
  }

  onServiceImgChange(e) {
    const selectedFile = e.target.files[0];

    if (verifyFileFormat(selectedFile)) {
      this.setState({ serviceImg: selectedFile });
    } else {
      alert("Unsupported file type. \nChoose .jpeg, .jpg, .webp or .png only");
      this.setState({ serviceImg: "" });
    }
  }

  handleWindowResize = () => {
    this.setState({ isMobile: window.innerWidth <= 600 });
  };

  getRowsForView(isMobile) {
    const rows = this.state.services.map((service) => {
      if (isMobile) {
        return [
          {
            id: service._id + "_serviceName",
            info: "Service Name",
            value: service.serviceName,
          },
          {
            id: service._id + "_serviceType",
            info: "Service Pet",
            value: service.serviceType,
          },
          {
            id: service._id + "_description",
            info: "Description",
            value: service.description,
          },
          {
            id: service._id + "_serviceImg",
            info: "Service Image",
            value: service.imageUrl,
          },
          {
            id: service._id + "_delete",
            info: "Delete",
            value: (
              <IconButton
                color="secondary"
                onClick={() => this.handleDeleteService(service._id)}
              >
                <DeleteIcon />
              </IconButton>
            ),
          },
          {
            id: service._id + "_update",
            info: "Update",
            value: (
              <IconButton
                color="secondary"
                onClick={() => this.handleUpdateService(service._id)}
              >
                <UpdateIcon />
              </IconButton>
            ),
          },
        ];
      } else {
        return {
          id: service._id,
          serviceName: service.serviceName,
          serviceType: service.serviceType,
          description: service.description,
          serviceImg: service.imageUrl,
        };
      }
    });

    return isMobile ? rows.flat() : rows;
  }

  async handleAddService(e) {
    e.preventDefault();

    if (this.state.showUpdatebtn) {
      const formData = new FormData();

      formData.append("serviceName", this.state.serviceName);
      formData.append("serviceType", this.state.serviceType);
      formData.append("description", this.state.description);
      formData.append("serviceImg", this.state.serviceImg);
      formData.append("serviceId", this.state.serviceId);

      try {
        let res = await fetch(`${this.props.apiUrl}/api/addServices`, {
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
                serviceName: "",
                serviceType: "",
                description: "",
                serviceImg: "",
              });
              this.formElement.reset();
              this.fetchServices();
            } else {
              console.log("service not added");
            }
          })
          .catch((err) => {
            console.log("Not added service", err);
          });
      } catch (err) {
        console.log(err);
      }
      this.setState({ showUpdatebtn: false });
    } else {
      if (this.state.services.length >= 3) {
        alert("Only 3 services can be added.");
      } else {
        if (this.state.serviceNameError || this.state.serviceDescError) {
          return alert("Errors check the form and submit again");
        }
        // console.log("VALUES", this.state.serviceName);

        const formData = new FormData();

        formData.append("serviceName", this.state.serviceName);
        formData.append("serviceType", this.state.serviceType);
        formData.append("description", this.state.description);
        formData.append("serviceImg", this.state.serviceImg);

        try {
          let res = await fetch(`${this.props.apiUrl}/api/addServices`, {
            method: "POST",
            body: formData,
            "Content-Type": "multipart/form-data",
          })
            .then((resp) => {
              if (resp.status === 201) {
                this.setState({
                  serviceAdded: true,
                  modalOpen: true,
                  serviceName: "",
                  serviceType: "",
                  description: "",
                  serviceImg: "",
                });
                this.formElement.reset();
                this.fetchServices();
              } else {
                console.log("service not added");
              }
            })
            .catch((err) => {
              console.log("Not added service ", err);
            });
        } catch (err) {
          console.log(err);
        }
      }
    }
  }

  async fetchServices() {
    try {
      // let res = await fetch(`${process.env.REACT_APP_APIURL}/api/services`, {
      let res = await fetch(`${this.props.apiUrl}/api/services`, {
        method: "GET",
        headers: new Headers({ "content-type": "application/json" }),
      });
      let resJson = await res.json();
      console.log("FETCHED SERVICES", resJson);
      if (res.status === 200) {
        // this.setState({ services: resJson});
        // console.log("UPDATED SERVICES", this.state.services);
        let serList = resJson.map((service, index) => {
          //to remove uploads or public in image path beginning
          const url = `${service.serviceImg.path}`.slice(7);

          const imgPath = `${this.props.apiUrl}/${url}`;
          // console.log(`image url for ${index}`, imgPath);
          let serviceWithImage = { ...resJson[index], imageUrl: imgPath };
          return serviceWithImage;
        });

        this.setState({ services: serList });
      } else {
        console.log("services not fetched");
      }
    } catch (err) {
      console.log(err);
    }
  }
  async handleUpdateService(id) {
    debugger;
    let res = await fetch(`${this.props.apiUrl}/api/formService/${id}`, {
      method: "GET",
      headers: new Headers({ "content-type": "application/json" }),
    });
    let resJson = await res.json();
    console.log("Fetch single service on uhpload buttino click ", resJson);
    if (res.status === 200) {
      console.log("FetchedServiceName ", this.state.serviceName);
      this.setState({
        // petType: resJson.petType,
        // categorySelected: resJson.categorySelected,
        serviceName: resJson.serviceName,
        serviceType: resJson.serviceType,
        description: resJson.description,
        serviceImg: resJson.serviceImg,
        serviceId: resJson._id,
        // categoryImage : resJson.imageUrl,
        showUpdatebtn: true,
      });
    } else console.log("categories not fetched");
  }
  catch(err) {
    console.log(err);
  }
  async handleDeleteService(id) {
    try {
      let res = await fetch(`${this.props.apiUrl}/api/deleteService/${id}`, {
        method: "DELETE",
        headers: new Headers({ "content-type": "application/json" }),
      });
      let resJson = await res.json();
      if (res.status === 200) {
        console.log("service deleted");
        this.setState({
          serviceDeleted: true,
          modalOpen: true,
        });
        this.fetchServices();
      } else {
        console.log("service not deleted");
      }
    } catch (err) {
      console.log(err);
    }
  }

  componentDidMount() {
    this.fetchServices();
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
              if (params.row.info === "Service Image") {
                return (
                  <a href={params.value} rel='noreferrer' target="_blank">
                    <img alt='serviceImage'
                      src={params.value}
                      style={{ height: 100, width: 50}}
                    />
                  </a>
                );
              }
              return params.value;
            },
          },
        ]
      : [
          { field: "serviceName", headerName: "Service Name", flex: 1 },
          { field: "serviceType", headerName: "Service Type", flex: 1 },
          { field: "description", headerName: "Description", flex: 1 },
          {
            field: "serviceImg",
            headerName: "Service Image",
            flex: 1,
            renderCell: (params) => (
              <a href={params.value} target="_blank" rel='noreferrer'>
                <img src={params.value} alt="serviceImg" style={{ height: 100, width: 50,objectFit:'contain'  }} />
              </a>
            ),
          },

          {
            field: "delete",
            headerName: "Delete",
            width: 100,
            renderCell: (params) => (
              <IconButton
                color="secondary"
                onClick={() => this.handleDeleteService(params.row.id)}
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
                color="secondary"
                onClick={() => this.handleUpdateService(params.row.id)}
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
        <form
          ref={(form) => (this.formElement = form)}
          onSubmit={this.handleAddService}
          className="myFormPad"
        >
          <h1 className="Title">Service</h1>
          <h5>Purpose - To display categories on UI as cards</h5>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item lg={2} md={2} sm={2} xs={12}>
              <InputLabel className="labelLike">
                Service Name{" "}
                <sup>
                  <strong>*</strong>
                </sup>
              </InputLabel>
            </Grid>
            <Grid item lg={3} md={2} sm={2} xs={12} sx={{ textAlign: "left" }}>
              <TextField
                // style={{ marginTop: "10px", marginBottom: "10px" }}
                placeholder="Enter Service Name"
                value={this.state.serviceName}
                name="serviceName"
                onChange={this.onServiceNameChange}
                className="textfield-spacing myFullInputs"
                variant="outlined"
                error={Boolean(this.state.serviceNameError)}
                helperText={this.state.serviceNameError}
                required
              />
            </Grid>

            <Grid item lg={2} md={2} sm={2} xs={12}>
              <InputLabel className="labelLike">
                Service Type{" "}
                <sup>
                  <strong>*</strong>
                </sup>
              </InputLabel>
            </Grid>
            <Grid item lg={3} md={2} sm={2} xs={12} sx={{ textAlign: "left" }}>
              <Select
                onChange={this.onServiceTypeChange}
                className="textfield-spacing select-width myFullInputs myFullDdn"
                variant="outlined"
                name="serviceType"
                displayEmpty="true"
                required
              >
                <InputLabel>Service Type</InputLabel>
                <MenuItem value={"grooming"}>Grooming</MenuItem>
                <MenuItem value={"domestice training"}>
                  Domestice Training
                </MenuItem>
                <MenuItem value={"washing"}>Washing</MenuItem>
                <MenuItem value={"general health"}>General Health</MenuItem>
              </Select>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
            required
          >
            <Grid item lg={2} md={2} sm={2} xs={12}>
              <InputLabel className="labelLike">
                Service Description{" "}
                <sup>
                  <strong>*</strong>
                </sup>
              </InputLabel>
            </Grid>
            <Grid item lg={3} md={2} sm={2} xs={12} sx={{ textAlign: "left" }}>
              <TextField
                style={{ marginTop: "5px", marginBottom: "10px" }}
                placeholder="Enter Description"
                value={this.state.description}
                name="description"
                onChange={this.onDescriptionChange}
                className="textfield-spacing myFullInputs"
                variant="outlined"
                error={Boolean(this.state.serviceDescError)}
                helperText={this.state.serviceDescError}
                required
              />
            </Grid>

            <Grid item lg={2} md={2} sm={2} xs={12}>
              <InputLabel className="labelLike" style={{ marginleft: "40px" }}>
                Service Image{" "}
                <sup>
                  <strong>*</strong>
                </sup>
              </InputLabel>
            </Grid>
            <Grid item lg={3} md={1} sm={2} xs={12} sx={{ textAlign: "left" }}>
              <TextField
                // style={{ marginTop: "5px", marginBottom: "10px", width: "56%" }}
                accept="image/*"
                className="myFullInputs"
                name="serviceImg"
                type="file"
                onChange={this.onServiceImgChange}
                required
              />
            </Grid>
          </Grid>

          {!this.state.showUpdatebtn ? (
            <Button
              className="textfield-spacing"
              type="submit"
              variant="contained"
              color="primary"
            >
              Add Service
            </Button>
          ) : (
            <Button
              className="textfield-spacing"
              type="submit"
              variant="contained"
              color="primary"
            >
              Update Service
            </Button>
          )}
          <br></br>
          {this.state.serviceAdded && (
            <SuccessModal
              open={this.state.modalOpen}
              handleClose={this.onModalClose}
              title="Service added successfully!"
              message="The Service details you have entered have been accepted and stored in the records accordingly.
          This window will close within 5 seconds"
            />
          )}
          {this.state.serviceUpdated && (
            <SuccessModal
              open={this.state.modalOpen}
              handleClose={this.onModalClose}
              title="Service Updated successfully!"
              message="The Service details you have updated have been stored in the records accordingly. 
          This window will close within 5 seconds"
            />
          )}
          {this.state.serviceDeleted && (
            <SuccessModal
              open={this.state.modalOpen}
              handleClose={this.onModalClose}
              title="Service Deleted successfully!"
              message="The Service record you chose has been deleted successfully from our records.
          This window will close within 5 seconds"
            />
          )}
        </form>
        <div className="dataGridContainer">
          {this.state.services.length > 0 ? (
            <DataGrid
              className="my-data-grid"
              rows={rows}
              columns={columns}
              pageSize={this.state.isMobile ? 6 : 5}

              // checkboxSelection
            />
          ) : this.state.services.length === 0 ? (
            <p>No services found</p>
          ) : (
            <p>Loading data...</p>
          )}
        </div>
      </div>
    );
  }
}
