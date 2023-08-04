import { Component } from "react";
import "./addCategory.css";
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
import { useMediaQuery } from "@mui/material";
import { verifyFileFormat } from "../../utilityFn/verifyFileFormat";

// import { withWidth } from '@material-ui/core/withWidth';
export default class CategoryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryName: "",
      categoryPet: "Select",
      categoryImage: "",
      categoryBanner: "",
      categoryDesc: "",
      isMobile: window.innerWidth <= 600,
      serviceAdded: false,
      serviceUpdated: false,
      serviceDeleted: false,
      categories: [],
      showUpdatebtn: false,
      categoryNameError: "",
      categoryDescError: "",
      modalOpen: false,
      categoryBannerError: "",
    };
    this.handleAddCategory = this.handleAddCategory.bind(this);
    this.onCategoryNameChange = this.onCategoryNameChange.bind(this);
    this.onPetChange = this.onPetChange.bind(this);
    this.onImageChange = this.onImageChange.bind(this);
    this.onBannerChange = this.onBannerChange.bind(this);
    this.onDescChange = this.onDescChange.bind(this);
    this.onModalClose = this.onModalClose.bind(this);
    this.handleDeleteCategory = this.handleDeleteCategory.bind(this);
    this.handleUpdateCategory = this.handleUpdateCategory.bind(this);
    // this.updateCategory = this.updateCategory(this);
  }

  // onMobileChange(e){

  // }
  onCategoryNameChange(e) {
    const regex = /^(?:[^\d\s]+(?:\s+[^\d\s]+)*)$/;
    const isValid = regex.test(e.target.value);
    if (isValid) {
      this.setState({ categoryName: e.target.value, categoryNameError: "" });
    } else {
      this.setState({
        categoryName: e.target.value,
        categoryNameError: "Can't have empty spaces",
      });
    }
  }
  onModalClose() {
    this.setState({ modalOpen: false ,
      serviceAdded: false,
      serviceUpdated: false,
      serviceDeleted: false,});
  }
  onPetChange(selectedPet) {
    // console.log('selectedPtet = ', selectedPet )
    this.setState({ categoryPet: selectedPet });
  }

  onImageChange(e) {
    // this.setState({ categoryImage: e.target.value });

    const selectedFile = e.target.files[0];

    if (verifyFileFormat(selectedFile)) {
      this.setState({ categoryImage: selectedFile });
    } else {
      alert(
        "Unsupported file type. \nChoose .jpeg, .jpg, .webp, .avif or .png only"
      );

      this.setState({ categoryImage: "" });
    }
  }

  onBannerChange(e) {
    const regex = /^(?!\s*$).+/;
    const isValid = regex.test(e.target.value);
    if (isValid) {
      this.setState({
        categoryBanner: e.target.value,
        categoryBannerError: "",
      });
    } else {
      this.setState({
        categoryBanner: e.target.value,
        categoryBannerError: "Banner cant be empty",
      });
    }
  }

  onDescChange(e) {
    const regex = /^(?!\s*$).+/;
    const isValid = regex.test(e.target.value);
    if (isValid) {
      this.setState({ categoryDesc: e.target.value, categoryDescError: "" });
    } else {
      this.setState({
        categoryDesc: e.target.value,
        categoryDescError: "Category Description cant be empty",
      });
    }
  }
  handleWindowResize = () => {
    this.setState({ isMobile: window.innerWidth <= 600 });
  };

  getRowsForView(isMobile) {
    const rows = this.state.categories.map((category) => {
      if (isMobile) {
        return [
          {
            id: category._id + "_categoryName",
            info: "Category Name",
            value: category.categoryName,
          },
          {
            id: category._id + "_categoryPet",
            info: "Category Pet",
            value: category.categoryPet,
          },
          {
            id: category._id + "_categoryImage",
            info: "Category Image",
            value: category.imageUrl,
          },
          {
            id: category._id + "_categoryBanner",
            info: "Category Banner",
            value: category.categoryBanner,
          },
          {
            id: category._id + "_categoryDesc",
            info: "Category Desc",
            value: category.categoryDesc,
          },
          {
            id: category._id + "_delete",
            info: "Delete",
            value: (
              <IconButton
                color='secondary'
                onClick={() => this.handleDeleteCategory(category._id)}
              >
                <DeleteIcon />
              </IconButton>
            ),
          },
          {
            id: category._id + "_update",
            info: "Update",
            value: (
              <IconButton
                color='secondary'
                onClick={() => this.handleUpdateCategory(category._id)}
              >
                <UpdateIcon />
              </IconButton>
            ),
          },
        ];
      } else {
        return {
          id: category._id,
          categoryName: category.categoryName,
          categoryPet: category.categoryPet,
          categoryImage: category.imageUrl,
          categoryBanner: category.categoryBanner,
          categoryDesc: category.categoryDesc,
        };
      }
    });

    return isMobile ? rows.flat() : rows;
  }

  async handleAddCategory(e) {
    e.preventDefault();

    if (this.state.showUpdatebtn) {
      const formData = new FormData();

      formData.append("categoryName", this.state.categoryName);
      formData.append("categoryPet", this.state.categoryPet);
      formData.append("categoryImage", this.state.categoryImage);
      formData.append("categoryBanner", this.state.categoryBanner);
      formData.append("categoryDesc", this.state.categoryDesc);
      formData.append("catId", this.state.categoryId);

      // for (let [key, value] of formData.entries()) {
      //   console.log(key, value);
      // }

      try {
        let res = await fetch(`${this.props.apiUrl}/api/addCategory`, {
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
                categoryName: "",
                categoryPet: "",
                categoryImage: "",
                categoryBanner: "",
                categoryDesc: "",
              });
              this.formElement.reset();
              this.fetchCategories();
            } else {
              console.log("category not added");
            }
          })
          .catch((err) => {
            console.log("Not added category ", err);
          });
      } catch (err) {
        console.log(err);
      }
      this.setState({ showUpdatebtn: false });
    } else {
      if (
        this.state.categoryNameError ||
        this.state.categoryBannerError ||
        this.state.categoryDescError ||
        this.state.categoryImage === ""
      ) {
        return alert("Errors check the form and submit again");
      } else {
        const formData = new FormData();

        formData.append("categoryName", this.state.categoryName);
        formData.append("categoryPet", this.state.categoryPet);
        formData.append("categoryImage", this.state.categoryImage);
        formData.append("categoryBanner", this.state.categoryBanner);
        formData.append("categoryDesc", this.state.categoryDesc);

        try {
          let res = await fetch(`${this.props.apiUrl}/api/addCategory`, {
            method: "POST",
            body: formData,
            "Content-Type": "multipart/form-data",
          })
            .then((resp) => {
              // console.log("category added");
              if (resp.status === 201) {
                this.setState({
                  serviceAdded: true,
                  modalOpen: true,
                  categoryName: "",
                  categoryPet: "",
                  categoryImage: "",
                  categoryBanner: "",
                  categoryDesc: "",
                });
                this.formElement.reset();
                this.fetchCategories();
              } else {
                console.log("category not added");
              }
            })
            .catch((err) => {
              console.log("Not added category ", err);
            });
        } catch (err) {
          console.log(err);
        }
      }
    }
  }

  async fetchCategories() {
    try {
      let res = await fetch(`${this.props.apiUrl}/api/categories`, {
        method: "GET",
        headers: new Headers({ "content-type": "application/json" }),
      });
      let resJson = await res.json();
      // console.log("FETCHED CATEGORIES", resJson);
      if (res.status === 200) {
        // this.setState({ categories: resJson });
        let catList = resJson.map((cat, index) => {
          //to remove uploads or public in image path beginning
          const url = `${cat.categoryImage.path}`.slice(7);

          const imgPath = `${this.props.apiUrl}/${url}`;
          // console.log(`image url for ${index}`, imgPath);
          let catWithImage = { ...resJson[index], imageUrl: imgPath };
          return catWithImage;
        });

        // console.log("FETCHED categorries image ", catList);

        this.setState({ categories: catList });
        // console.log("UPDATED CATEGORIES", this.state.categories);
      } else {
        console.log("categories not fetched");
      }
    } catch (err) {
      console.log(err);
    }
  }
  async handleDeleteCategory(id) {
    try {
      let res = await fetch(`${this.props.apiUrl}/api/deleteCategory/${id}`, {
        method: "DELETE",
        headers: new Headers({ "content-type": "application/json" }),
      });
      let resJson = await res.json();
      if (res.status === 200) {
        console.log("category deleted");
        this.setState({
          serviceDeleted: true,
          modalOpen: true,
        });
        this.fetchCategories();
      } else {
        console.log("category not deleted");
      }
    } catch (err) {
      console.log(err);
    }
  }
  async handleUpdateCategory(id) {
    debugger;
    let res = await fetch(`${this.props.apiUrl}/api/formValues/${id}`, {
      method: "GET",
      headers: new Headers({ "content-type": "application/json" }),
    });
    let resJson = await res.json();
    console.log("Fetch single category on uhpload buttino click ", resJson);
    if (res.status === 200) {
      console.log("FetchedCategoryName ", this.state.categoryName);
      this.setState({
        categoryName: resJson.categoryName,
        categoryPet: resJson.categoryPet,
        categoryBanner: resJson.categoryBanner,
        categoryDesc: resJson.categoryDesc,
        categoryId: resJson._id,
        // categoryImage : resJson.imageUrl,
        showUpdatebtn: true,
      });
    } else console.log("categories not fetched");
  }
  catch(err) {
    console.log(err);
  }

  componentDidMount() {
    this.fetchCategories();
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
              if (params.row.info === "Category Image") {
                return (
                  <a href={params.value} target='_blank'>
                    <img
                      src={params.value}
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
          { field: "categoryName", headerName: "Category Name", flex: 1 },
          { field: "categoryPet", headerName: "Category Pet", flex: 1 },
          {
            field: "categoryImage",
            headerName: "Category Image",
            flex: 1,
            renderCell: (params) => (
              <a href={params.value} target='_blank'>
                <img src={params.value} style={{ height: 100, width: 50,objectFit:'contain' }} alt="" />
              </a>
            ),
          },
          { field: "categoryBanner", headerName: "Category Banner", flex: 1 },
          {
            field: "categoryDesc",
            headerName: "Category Description",
            flex: 1,
          },
          {
            field: "delete",
            headerName: "Delete",
            width: 100,
            renderCell: (params) => (
              <IconButton
                color='secondary'
                onClick={() => this.handleDeleteCategory(params.row.id)}
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
                onClick={() => this.handleUpdateCategory(params.row.id)}
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
        <form ref={form => this.formElement = form} onSubmit={this.handleAddCategory} className='myFormPad'>       
          <h1 className="Title">Category</h1>
          <h5>Purpose - For categories on customerUI </h5>
          <input type='hidden' name='catId' value={this.state.categoryId} />
          <Grid
            container
            spacing={2}
            justifyContent='center'
            alignItems='center'
          >
            <PetTypeDdn
              
              callbackPetType={this.onPetChange}
              showUpdatebtn={this.state.showUpdatebtn}
            ></PetTypeDdn>
            <Grid item lg={2} md={2} sm={12} xs={12}>
              <InputLabel className="labelLike">
                Category Name{" "}
                <sup>
                  <strong>*</strong>
                </sup>{" "}
              </InputLabel>
            </Grid>
            <Grid item lg={3} md={2} sm={12} xs={12} sx={{ textAlign: "left" }}>
              <TextField 
                // style={{
                //   marginTop: "5px",
                //   marginBottom: "10px",
                //   border: "none",
                //   width:'100%'
                // }}
                className="textfield-spacing myFullInputs"
                label="Enter Category Name"
                variant="outlined"
                name="categoryName"
                value={this.state.categoryName}
                onChange={this.onCategoryNameChange}
                error={Boolean(this.state.categoryNameError)}
                helperText={this.state.categoryNameError}
                required
              />
            </Grid>
          </Grid>

          <Grid
            container
            spacing={2}
            justifyContent='center'
            alignItems='center'
          >
            <Grid item lg={2} md={2} sm={2} xs={12}>
              <InputLabel className='labelLike'>
                Category Banner{" "}
                <sup>
                  <strong>*</strong>
                </sup>
              </InputLabel>
            </Grid>
            <Grid item lg={3} md={2} sm={2} xs={12} sx={{ textAlign: "left" }}>
              <TextField
                // style={{ marginTop: "5px", marginBottom: "10px" , width:'100%'}}
                className="textfield-spacing myFullInputs"
                label="Enter Category Banner"
                variant="outlined"
                name="categoryBanner"
                value={this.state.categoryBanner}
                onChange={this.onBannerChange}
                error={Boolean(this.state.categoryBannerError)}
                helperText={this.state.categoryBannerError}
                required
              />
            </Grid>
            <Grid item lg={2} md={2} sm={2} xs={12}>
              <InputLabel className='labelLike'>
                Category Desc{" "}
                <sup>
                  <strong>*</strong>
                </sup>
              </InputLabel>
            </Grid>

            <Grid item lg={3} md={2} sm={2} xs={12} sx={{ textAlign: "left" }}>
              <TextField
                style={{ marginTop: "5px", marginBottom: "10px" }}
                className="textfield-spacing myFullInputs"
                label="Enter Category Description"
                variant="outlined"
                name="categoryDesc"
                value={this.state.categoryDesc}
                onChange={this.onDescChange}
                error={Boolean(this.state.categoryDescError)}
                helperText={this.state.categoryDescError}
                required
              />
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            justifyContent='center'
            alignItems='center'
          >
            <Grid item lg={2} md={2} sm={2} xs={12}>
              <InputLabel className='labelLike'>
                Upload Category Image{" "}
                <sup>
                  <strong>*</strong>
                </sup>
              </InputLabel>
            </Grid>

            <Grid item lg={3} md={2} sm={2} xs={12} sx={{ textAlign: "left" }}>
              <TextField className='myFullInputs'
                // style={{ marginTop: "5px", marginBottom: "10px", width: "56%" }}
                accept="image/*"
                name="categoryImage"
                type="file"
                onChange={this.onImageChange}
                required
              />
            </Grid>
            <Grid item lg={2} md={2} sm={2} xs={12}></Grid>

            <Grid
              item
              lg={3}
              md={2}
              sm={2}
              xs={12}
              sx={{ textAlign: "left" }}
            ></Grid>
          </Grid>
          {!this.state.showUpdatebtn ? (
            <Button
              className='textfield-spacing'
              type='submit'
              variant='contained'
              color='primary'
            >
              Add Category
            </Button>
          ) : (
            <Button
              className='textfield-spacing'
              type='submit'
              variant='contained'
              color='primary'
            >
              UPDATE
            </Button>
          )}
          <br></br>
          {this.state.serviceAdded && (
            <SuccessModal
              open={this.state.modalOpen}
              handleClose={this.onModalClose}
              title='Category added successfully!'
              message='The category details you have entered have been accepted and stored in the records accordingly.
          This window will close within 5 seconds'
            />
          )}
          {this.state.serviceUpdated && (
            <SuccessModal
              open={this.state.modalOpen}
              handleClose={this.onModalClose}
              title='Category Updated successfully!'
              message='The category details you have updated have been stored in the records accordingly. 
          This window will close within 5 seconds'
            />
          )}
          {this.state.serviceDeleted && (
            <SuccessModal
              open={this.state.modalOpen}
              handleClose={this.onModalClose}
              title='Category Deleted successfully!'
              message='The category record you chose has been deleted successfully from our records.
          This window will close within 5 seconds'
            />
          )}
        </form>

        <div className='dataGridContainer'>
          {this.state.categories.length > 0 ? (
            <DataGrid
              className='my-data-grid'
              rows={rows}
              columns={columns}
              pageSize={this.state.isMobile ? 7 : 5}

              // checkboxSelection
            />
          ) : this.state.categories.length === 0 ? (
            <p>No categories found</p>
          ) : (
            <p>Loading data...</p>
          )}
        </div>
      </div>
    );
  }
}
