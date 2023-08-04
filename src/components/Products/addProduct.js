import { Component } from "react";
import "./addProduct.css";
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

export default class ProductForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productName: "",
      productRating: "",
      productDesc: "",
      productImage: "",
      productPrice: "",
      serviceAdded: false,
      isMobile: window.innerWidth <= 600,
      products: [],
      showUpdatebtn: false,
      productNameError: "",
      productDescError: "",
      productPriceError: "",
      serviceUpdated: false,
      serviceDeleted: false,
      modalOpen: false,
      categoryDdn: [],
      petType: "",
      categorySelected: "",
    };
    this.handleAddProduct = this.handleAddProduct.bind(this);
    this.onProductNameChange = this.onProductNameChange.bind(this);
    this.onRatingChange = this.onRatingChange.bind(this);
    this.onProductDescChange = this.onProductDescChange.bind(this);
    this.onProductImageChange = this.onProductImageChange.bind(this);
    this.onPriceChange = this.onPriceChange.bind(this);
    this.handleDeleteProduct = this.handleDeleteProduct.bind(this);
    this.onPetChange = this.onPetChange.bind(this);
    this.onCategoryChange = this.onCategoryChange.bind(this);
    this.handleUpdateProduct = this.handleUpdateProduct.bind(this);
    this.onModalClose = this.onModalClose.bind(this);
  }

  
  onProductNameChange(e) {
    const regex = /^(?!\s*$).+/;
    const isValid = regex.test(e.target.value);
    if (isValid) {
      this.setState({ productName: e.target.value, productNameError: "" });
    } else {
      this.setState({
        productName: e.target.value,
        productNameError:
          "reject inputs that contain any digits, special characters, or symbols.For Ex.Dog Food",
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
  onRatingChange(e) {
    this.setState({ productRating: e.target.value });
  }
  onProductDescChange(e) {
    const regex = /^(?!\s*$).+/;
    const isValid = regex.test(e.target.value);
    if (isValid) {
      this.setState({ productDesc: e.target.value, productDescError: "" });
    } else {
      this.setState({
        productDesc: e.target.value,
        productDescError: "Description cant be empty",
      });
    }
  }

  onProductImageChange(e) {
    const selectedFile = e.target.files[0];

    if (verifyFileFormat(selectedFile)) {
      this.setState({ productImage: selectedFile });
    } else {
      alert("Unsupported file type. \nChoose .jpeg, .jpg, .webp or .png only");
      this.setState({ productImage: "" });
    }
  }

  onPriceChange(e) {
    const regex = /^\d+(\.\d{1,2})?$/;
    const isValid = regex.test(e.target.value);
    if (isValid) {
      this.setState({ productPrice: e.target.value, productPriceError: "" });
    } else {
      this.setState({
        productPrice: e.target.value,
        productPriceError:
          "Please enter a valid price with up to 2 decimal places.",
      });
    }
  }

  onPetChange(selectedPet) {
    console.log("selectedPtet = ", selectedPet);
    this.setState({ petType: selectedPet });
    this.getCategories(selectedPet);
  }
  onCategoryChange(selectedCat) {
    // const isReadOnly = this.state.showUpdatebtn;
    // if (!isReadOnly) {
    const category = selectedCat.target.value;
    // console.log('selected category =', category);
    this.setState({ categorySelected: category });
    // }
  }
  handleWindowResize = () => {
    this.setState({ isMobile: window.innerWidth <= 600 });
  };

  getRowsForView(isMobile) {
    const rows = this.state.products.map((product) => {
      if (isMobile) {
        return [
          {
            id: product._id + "_forPet",
            info: "Pet",
            value: product.forPet,
          },
          {
            id: product._id + "_category",
            info: "Category",
            value: product.category,
          },
          {
            id: product._id + "_productName",
            info: "Name",
            value: product.productName,
          },
          {
            id: product._id + "_productPrice",
            info: "Price",
            value: product.productPrice,
          },
          {
            id: product._id + "_productRating",
            info: "Rating",
            value: product.productRating,
          },
          {
            id: product._id + "_productDesc",
            info: "Description",
            value: product.productDesc,
          },{
            id: product._id + "_productImage",
            info: "Product Image",
            value: product.productImage,
          },
          {
            id: product._id + "_delete",
            info: "Delete",
            value: (
              <IconButton
                color="secondary"
                onClick={() => this.handleDeleteProduct(product._id)}
              >
                <DeleteIcon />
              </IconButton>
            ),
          },
          {
            id: product._id + "_update",
            info: "Update",
            value: (
              <IconButton
                color="secondary"
                onClick={() => this.handleUpdateProduct(product._id)}
              >
                <UpdateIcon />
              </IconButton>
            ),
          },
        ];
      } else {
        return {
          id: product._id,
          forPet: product.forPet,
          category: product.category,
          productName: product.productName,
          productPrice: product.productPrice,
          productRating: product.productRating,
          productDesc: product.productDesc,
          productImage: product.imageUrl,
          productPrice: product.productPrice,
        };
      }
    });

    return isMobile ? rows.flat() : rows;
  }

  async handleAddProduct(e) {
    e.preventDefault();

    if (this.state.showUpdatebtn) {
      const formData = new FormData();

      // formData.append("forPet", this.state.petType);
      // formData.append("categoryPet", this.state.categorySelected);
      formData.append("productName", this.state.productName);
      formData.append("productRating", this.state.productRating);
      formData.append("productDesc", this.state.productDesc);
      formData.append("productImage", this.state.productImage);
      formData.append("productPrice", this.state.productPrice);
      formData.append("prodId", this.state.productId);

      // for (let [key, value] of formData.entries()) {
      //   console.log(key, value);
      // }

      try {
        let res = await fetch(`${this.props.apiUrl}/api/addProduct`, {
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
                productName: "",
                productRating: "",
                productDesc: "",
                productImage: "",
                productPrice: "",
                petType: "",
                categorySelected: "",
              });
              this.formElement.reset();
              this.fetchProducts();
            } else {
              console.log("product not added");
            }
          })
          .catch((err) => {
            console.log("Not added product", err);
          });
      } catch (err) {
        console.log(err);
      }
      this.setState({ showUpdatebtn: false });
    } else {
      if (
        this.state.productNameError ||
        this.state.productPriceError ||
        this.state.productDescError ||
        this.state.productImage === ""
      ) {
        return alert("Errors check the form and submit again");
      } else {
        const formData = new FormData();

        formData.append("forPet", this.state.petType);
        formData.append("categoryPet", this.state.categorySelected);
        formData.append("productName", this.state.productName);
        formData.append("productRating", this.state.productRating);
        formData.append("productDesc", this.state.productDesc);
        formData.append("productImage", this.state.productImage);
        formData.append("productPrice", this.state.productPrice);

        try {
          let res = await fetch(`${this.props.apiUrl}/api/addProduct`, {
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
                  productName: "",
                  productRating: "",
                  productDesc: "",
                  productImage: "",
                  productPrice: "",
                  petType: "",
                  categorySelected: "",
                });
                this.formElement.reset();
                this.fetchProducts();
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
  async handleUpdateProduct(id) {
    debugger;
    let res = await fetch(`${this.props.apiUrl}/api/formProduct/${id}`, {
      method: "GET",
      headers: new Headers({ "content-type": "application/json" }),
    });
    let resJson = await res.json();
    console.log("Fetch single product on uhpload buttino click ", resJson);
    if (res.status === 200) {
      console.log("FetchedProductName ", this.state.productName);
      this.setState({
        // petType: resJson.petType,
        // categorySelected: resJson.categorySelected,
        productName: resJson.productName,
        productRating: resJson.productRating,
        productDesc: resJson.productDesc,
        productPrice: resJson.productPrice,
        productId: resJson._id,
        // categoryImage : resJson.imageUrl,
        showUpdatebtn: true,
      });
    } else console.log("categories not fetched");
  }
  catch(err) {
    console.log(err);
  }

  async getCategories(selectedPet) {
    // let pet = '';
    // if(this.state.petType == null || this.state.petType === '')
    // pet = selectedPet;
    // else
    // pet = this.state.petType;

    console.log("fetch categories for ", selectedPet);
    let res = await fetch(
      `${this.props.apiUrl}/api/getCategories?pet=${selectedPet}`
    );
    let data = res.json();
    data
      .then((resp) => {
        // console.log("data for ddn ", resp);
        const catDdn = resp.map((cat) => {
          return cat.categoryName;
        });
        this.setState({ categoryDdn: catDdn });
      })
      .catch((err) => {
        console.log("Error while feteching category dropdown ", err);
      });
  }
  async fetchProducts() {
    try {
      let res = await fetch(`${this.props.apiUrl}/api/products`, {
        method: "GET",
        headers: new Headers({ "content-type": "application/json" }),
      });
      let resJson = await res.json();
      // console.log("FETCHED PRODUCTS", resJson);
      if (res.status === 200) {
        let productList = resJson.map((product, index) => {
          //to remove uploads or public in image path beginning
          const url = `${product.productImage.path}`.slice(7);

          const imgPath = `${this.props.apiUrl}/${url}`;
          // console.log(`image url for ${index}`, imgPath);
          let prodsWithImage = { ...resJson[index], imageUrl: imgPath };
          return prodsWithImage;
        });
        // console.log("FETCHED PRODUCTSwith image ", productList);

        this.setState({ products: productList });
        // console.log("UPDATED PETS", this.state.products);
      } else {
        console.log("Products not fetched");
      }
    } catch (err) {
      console.log(err);
    }
  }

  async handleDeleteProduct(id) {
    try {
      let res = await fetch(`${this.props.apiUrl}/api/deleteProduct/${id}`, {
        method: "DELETE",
        headers: new Headers({ "content-type": "application/json" }),
      });
      let resJson = await res.json();
      if (res.status === 200) {
        this.setState({
          serviceDeleted: true,
          modalOpen: true,
        });
        this.fetchProducts();
      } else {
        console.log("product not deleted");
      }
    } catch (err) {
      console.log(err);
    }
  }
  componentDidMount() {
    this.fetchProducts();
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
            if (params.row.info === "Product Image") {
              return (
                <a href={params.value} rel='noreferrer' target='_blank'>
                  <img alt="productimage"
                    src={params.value}
                    style={{ height: 100, width: 50,objectFit:'contain'  }}
                  />
                </a>
              );
            }
            return params.value;
          },
        },
      ]
    : [
      { field: "forPet", headerName: "Pet", flex: 1 },
      { field: "category", headerName: "Category", flex: 1 },
      { field: "productName", headerName: "Name", flex: 1 },
      { field: "productPrice", headerName: "Price", flex: 1 },
      { field: "productRating", headerName: "Rating", flex: 1 },
      { field: "productDesc", headerName: "Description", flex: 1 },
      {
        field: "productImage",
        headerName: "Product Image",
        flex: 1,
        renderCell: (params) => (
          <a href={params.value} target="_blank" rel='noreferrer'>
            <img src={params.value} alt='productimage' style={{ height: 100, width: 50,objectFit:'contain' }} />
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
            onClick={() => this.handleDeleteProduct(params.row.id)}
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
            onClick={() => this.handleUpdateProduct(params.row.id)}
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
          onSubmit={this.handleAddProduct}
          className='myFormPad'>
          <h1 className="Title">Product</h1>
          <h5>Purpose - For adding products with categories and pet type</h5>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <PetTypeDdn
              callbackPetType={this.onPetChange}
              showUpdatebtn={this.state.showUpdatebtn}
            ></PetTypeDdn>

            <Grid item lg={2} md={2} sm={2} xs={12}>
              <InputLabel className="labelLike">
                Category Type{" "}
                <sup>
                  <strong>*</strong>
                </sup>
              </InputLabel>
            </Grid>

            <Grid item lg={3} md={2} sm={2} xs={12} sx={{ textAlign: "left" }}>
              <Select
                onChange={this.onCategoryChange}
                className="textfield-spacing select-width myFullInputs myFullDdn"
                variant="outlined"
                name="categoryPet"
                width="100px"
                displayEmpty={true}
                readOnly={this.state.showUpdatebtn}
                disabled={this.state.showUpdatebtn}
              >
                <InputLabel>Category</InputLabel>
                {this.state.categoryDdn.map((cat, index) => {
                  return (
                    <MenuItem key={index} value={cat}>
                      {cat}
                    </MenuItem>
                  );
                })}
                {/* <MenuItem value={"Dog"}>DogFood</MenuItem> */}
              </Select>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item lg={2} md={2} sm={2} xs={12}>
              <InputLabel className="labelLike">
                Product Name{" "}
                <sup>
                  <strong>*</strong>
                </sup>
              </InputLabel>
            </Grid>
            <Grid item lg={3} md={2} sm={2} xs={12} sx={{ textAlign: "left" }}>
              <TextField
                // style={{ marginTop: "10px", marginBottom: "10px" }}
                label="Enter Product Name"
                value={this.state.productName}
                name="productName"
                onChange={this.onProductNameChange}
                className="textfield-spacing myFullInputs"
                variant="outlined"
                error={Boolean(this.state.productNameError)}
                helperText={this.state.productNameError}
                required
              />
            </Grid>
            <Grid item lg={2} md={2} sm={2} xs={12}>
              <InputLabel className="labelLike">
                Product Rating{" "}
                <sup>
                  <strong>*</strong>
                </sup>
              </InputLabel>
            </Grid>
            <Grid item lg={3} md={2} sm={2} xs={12} sx={{ textAlign: "left" }}>
              <Select
                onChange={this.onRatingChange}
                className="textfield-spacing select-width myFullDdn "
                variant="outlined"
                name="productRating"
                width="100px"
                displayEmpty={true}
                required
              >
                <InputLabel>Enter Product Rating</InputLabel>
                <MenuItem key={1} value={"1"}>
                  1
                </MenuItem>
                <MenuItem key={2} value={"2"}>
                  2
                </MenuItem>
                <MenuItem key={3} value={"3"}>
                  3
                </MenuItem>
                <MenuItem key={4} value={"4"}>
                  4
                </MenuItem>
                <MenuItem key={5} value={"5"}>
                  5
                </MenuItem>
              </Select>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item lg={2} md={2} sm={2} xs={12}>
              <InputLabel className="labelLike">
                Product Description{" "}
                <sup>
                  <strong>*</strong>
                </sup>
              </InputLabel>
            </Grid>
            <Grid item lg={3} md={2} sm={2} xs={12} sx={{ textAlign: "left" }}>
              <TextField
                // style={{ marginTop: "5px", marginBottom: "10px" }}
                label="Enter Product Description"
                value={this.state.productDesc}
                name="productDesc"
                onChange={this.onProductDescChange}
                className="textfield-spacing myFullInputs"
                variant="outlined"
                error={Boolean(this.state.productDescError)}
                helperText={this.state.productDescError}
                required
              />
            </Grid>

            <Grid item lg={2} md={2} sm={2} xs={12}>
              <InputLabel className="labelLike">
                Product Image{" "}
                <sup>
                  <strong>*</strong>
                </sup>
              </InputLabel>
            </Grid>
            <Grid item lg={3} md={2} sm={2} xs={12} sx={{ textAlign: "left" }}>
              <TextField className="myFullInputs"
                // style={{ marginTop: "5px", marginBottom: "10px", width: "56%" }}
                accept="image/*"
                name="productImage"
                type="file"
                onChange={this.onProductImageChange}
                required
              />
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item lg={2} md={2} sm={2} xs={12}>
              <InputLabel className="labelLike">
                Product Price{" "}
                <sup>
                  <strong>*</strong>
                </sup>
              </InputLabel>
            </Grid>
            <Grid item lg={3} md={2} sm={2} xs={12} sx={{ textAlign: "left" }}>
              <TextField
                // style={{ marginTop: "5px", marginBottom: "10px" }}
                label="Enter Product Price"
                value={this.state.productPrice}
                name="productPrice"
                onChange={this.onPriceChange}
                className="textfield-spacing myFullInputs"
                variant="outlined"
                error={Boolean(this.state.productPriceError)}
                helperText={this.state.productPriceError}
                required
              />
            </Grid>
            <Grid item lg={2} md={2} sm={2} xs={12}>
              <InputLabel className="labelLike"></InputLabel>
            </Grid>
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
              className="textfield-spacing"
              type="submit"
              variant="contained"
              color="primary"
            >
              Add Product
            </Button>
          ) : (
            <Button
              className="textfield-spacing"
              type="submit"
              variant="contained"
              color="primary"
            >
              Update Product
            </Button>
          )}
          <br></br>
          {this.state.serviceAdded && (
            <SuccessModal
              open={this.state.modalOpen}
              handleClose={this.onModalClose}
              title="Product added successfully!"
              message="The Product details you have entered have been accepted and stored in the records accordingly.
          This window will close within 5 seconds"
            />
          )}
          {this.state.serviceUpdated && (
            <SuccessModal
              open={this.state.modalOpen}
              handleClose={this.onModalClose}
              title="Product Updated successfully!"
              message="The Product details you have updated have been stored in the records accordingly. 
          This window will close within 5 seconds"
            />
          )}
          {this.state.serviceDeleted && (
            <SuccessModal
              open={this.state.modalOpen}
              handleClose={this.onModalClose}
              title="Product Deleted successfully!"
              message="The Product record you chose has been deleted successfully from our records.
          This window will close within 5 seconds"
            />
          )}
        </form>
        <div className='dataGridContainer'>
          {this.state.products.length > 0 ? (
            <DataGrid
              className='my-data-grid'
              rows={rows}
              columns={columns}
              pageSize={this.state.isMobile ? 9 : 5}

              // checkboxSelection
            />
          ) : this.state.products.length === 0 ? (
            <p>No products found</p>
          ) : (
            <p>Loading data...</p>
          )}
        </div>
      </div>
    );
  }
}
