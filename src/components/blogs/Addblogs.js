import { Component } from "react";
import "./addblogs.css";
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

export default class blogs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Title: "",
      Content: "",
      blogImage: "",
      blogs: [],
      isMobile: window.innerWidth <= 600,
      BlogTitleError: "",
      BlogContentError: "",
      serviceAdded: false,
      showUpdatebtn: false,
      serviceUpdated: false,
      serviceDeleted: false,
    };
    this.handleAddblogs = this.handleAddblogs.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onContentChange = this.onContentChange.bind(this);
    this.onImageChange = this.onImageChange.bind(this);
    this.handleUpdateBlog = this.handleUpdateblog.bind(this);
    this.handleDeleteBlog = this.handleDeleteBlog.bind(this);
    this.onModalClose = this.onModalClose.bind(this);
  }
  handleWindowResize = () => {
    this.setState({ isMobile: window.innerWidth <= 600 });
  };
  onModalClose() {
    this.setState({
      modalOpen: false,
      serviceAdded: false,
      serviceUpdated: false,
      serviceDeleted: false,
    });
  }
  onTitleChange(e) {
    const regex = /^(?!\s*$).+/;
    const isValid = regex.test(e.target.value);
    if (isValid) {
      this.setState({ Title: e.target.value, BlogTitleError: "" });
    } else {
      this.setState({
        Title: e.target.value,
        BlogTitleError: "Title cant be empty",
      });
    }
  }
  onContentChange(e) {
    const regex = /^(?!\s*$).+/;
    const isValid = regex.test(e.target.value);
    if (isValid) {
      this.setState({ Content: e.target.value, blogContentError: "" });
    } else {
      this.setState({
        Content: e.target.value,
        blogContentError: "Content cant be empty",
      });
    }
  }

  onImageChange(e) {
    // this.setState({ Image: e.target.value });
    const selectedFile = e.target.files[0];

    if (verifyFileFormat(selectedFile)) {
      this.setState({ blogImage: selectedFile });
    } else {
      alert("Unsupported file type. \nChoose .jpeg, .jpg, .webp or .png only");
      this.setState({ blogImage: "" });
    }
  }
  getRowsForView(isMobile) {
    const rows = this.state.blogs.map((blog) => {
      if (isMobile) {
        return [
          {
            id: blog._id + "_Title",
            info: "Blog Title",
            value: blog.Title,
          },
          {
            id: blog._id + "_Content",
            info: "Content",
            value: blog.Content,
          },
          
          {
            id: blog._id + "_blogImage",
            info: "Blog Image",
            value: blog.blogImage,
          },
          {
            id: blog._id + "_delete",
            info: "Delete",
            value: (
              <IconButton
                color="secondary"
                onClick={() => this.handleDeleteBlog(blog._id)}
              >
                <DeleteIcon />
              </IconButton>
            ),
          },
          {
            id: blog._id + "_update",
            info: "Update",
            value: (
              <IconButton
                color="secondary"
                onClick={() => this.handleUpdateblog(blog._id)}
              >
                <UpdateIcon />
              </IconButton>
            ),
          },
        ];
      } else {
        return {
          id: blog._id,
          Title: blog.Title,
          Content: blog.Content,
          Image: blog.blogImage,
        };
      }
    });

    return isMobile ? rows.flat() : rows;
  }
  async handleAddblogs(e) {
    e.preventDefault();

    if (this.state.showUpdatebtn) {
      const formData = new FormData();

      formData.append("Title", this.state.Title);
      formData.append("Content", this.state.Content);
      formData.append("blogImage", this.state.blogImage);
      formData.append("blogId", this.state.blogId);

      try {
        let res = await fetch(`${this.props.apiUrl}/api/addBlogs`, {
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
                Title: "",
                Content: "",
                blogImage: "",
              });
              this.formElement.reset();
              this.fetchBlogs();
            } else {
              console.log("Blog not added");
            }
          })
          .catch((err) => {
            console.log("Not added Blog", err);
          });
      } catch (err) {
        console.log(err);
      }
      this.setState({ showUpdatebtn: false });
    } else {
      const formData = new FormData();

      formData.append("Title", this.state.Title);
      formData.append("Content", this.state.Content);
      formData.append("blogImage", this.state.blogImage);

      try {
        let res = await fetch(`${this.props.apiUrl}/api/addBlogs`, {
          method: "POST",
          body: formData,
          "Content-Type": "multipart/form-data",
        })
          .then((resp) => {
            if (resp.status === 201) {
              this.setState({
                serviceAdded: true,
                modalOpen: true,
                Title: "",
                Content: "",
                blogImage: "",
              });
              this.formElement.reset();
              this.fetchBlogs();
            } else {
              console.log("Blog not added");
            }
          })
          .catch((err) => {
            console.log("Not added Blog ", err);
          });
      } catch (err) {
        console.log(err);
      }
    }
  }

  async fetchBlogs() {
    try {
      let res = await fetch(`${this.props.apiUrl}/api/blogs`, {
        method: "GET",
        headers: new Headers({ "content-type": "application/json" }),
      });
      let resJson = await res.json();
      // console.log("FETCHED BLOGS", resJson);
      if (res.status === 200) {
        let blogList = resJson.map((blog, index) => {
          //to remove uploads or public in image path beginning
          const url = `${blog.blogImage.path}`.slice(7);
          const imgPath = `${this.props.apiUrl}/${url}`;
          let blogWithImg = { ...resJson[index], imageUrl: imgPath };
          return blogWithImg;
        });

        // console.log("FETCHED blogs image ", blogList);

        this.setState({ blogs: blogList });
      } else {
        console.log("blogs not fetched");
      }
    } catch (err) {
      console.log(err);
    }
  }
  async handleUpdateblog(id) {
    debugger;
    let res = await fetch(`${this.props.apiUrl}/api/formBlog/${id}`, {
      method: "GET",
      headers: new Headers({ "content-type": "application/json" }),
    });
    let resJson = await res.json();
    console.log("Fetch blog service on uhpload buttino click ", resJson);
    if (res.status === 200) {
      console.log("FetchedBlogName ", this.state.Title);
      this.setState({
        Title: resJson.Title,
        Content: resJson.Content,
        blogImage: resJson.blogImage,
        blogId: resJson._id,

        showUpdatebtn: true,
      });
    } else console.log("blog not fetched");
  }
  catch(err) {
    console.log(err);
  }
  async handleDeleteBlog(id) {
    try {
      let res = await fetch(`${this.props.apiUrl}/api/deleteBlog/${id}`, {
        method: "DELETE",
        headers: new Headers({ "content-type": "application/json" }),
      });
      let resJson = await res.json();
      if (res.status === 200) {
        console.log("blog deleted");
        this.setState({
          serviceDeleted: true,
          modalOpen: true,
        });
        this.fetchBlogs();
      } else {
        console.log("blog not deleted");
      }
    } catch (err) {
      console.log(err);
    }
  }
  componentDidMount() {
    this.fetchBlogs();
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
              if (params.row.info === "Blog Image") {
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
      { field: "Title", headerName: "Blog Title", flex: 1 },
      { field: "Content", headerName: "Blog Content", flex: 1 },
      {
        field: "Image",
        headerName: "Blog Image",
        flex: 1,
        renderCell: (params) => (
          <a href={params.value} target="_blank">
            <img src={params.value} style={{ height: 100, width: 50 }} />
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
            onClick={() => this.handleDeleteBlog(params.row.id)}
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
            onClick={() => this.handleUpdateblog(params.row.id)}
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
          onSubmit={this.handleAddblogs} className='myFormPad'
        >
          <h1 className="Title">Blog</h1>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item lg={2} md={2} sm={2} xs={12}>
              <InputLabel className="labelLike">
                Blog Title{" "}
                <sup>
                  <strong>*</strong>
                </sup>
              </InputLabel>
            </Grid>
            <Grid item lg={3} md={2} sm={2} xs={12}>
              <TextField
                style={{ marginTop: "10px", marginBottom: "10px" }}
                value={this.state.Title}
                name="Title"
                onChange={this.onTitleChange}
                className="textfield-spacing myFullInputs"
                variant="outlined"
                error={Boolean(this.state.BlogTitleError)}
                helperText={this.state.BlogTitleError}
                required
              />
            </Grid>

            <Grid item lg={2} md={2} sm={2} xs={12}>
              <InputLabel className="labelLike">
                Blog Content{" "}
                <sup>
                  <strong>*</strong>
                </sup>
              </InputLabel>
            </Grid>
            <Grid item lg={3} md={2} sm={2} xs={12}>
              <TextField
                // style={{ marginTop: "5px", marginBottom: "0px" }}
                value={this.state.Content}
                name="Content"
                rows={10}
                onChange={this.onContentChange}
                className="textfield-spacing myFullInputs"
                variant="outlined"
                error={Boolean(this.state.BlogContentError)}
                helperText={this.state.BlogContentError}
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
                Blog Image{" "}
                <sup>
                  <strong>*</strong>
                </sup>
              </InputLabel>
            </Grid>
            <Grid item lg={3} md={2} sm={2} xs={12}>
              <TextField
                // style={{ marginTop: "5px", marginBottom: "10px", width: "56%" }}
                className='myFullInputs'
                accept="image/*"
                name="blogImage"
                type="file"
                onChange={this.onImageChange}
                required
              />
            </Grid>
            <Grid item lg={2} md={2} sm={2} xs={12}>
              <InputLabel className="labelLike"></InputLabel>
            </Grid>
            <Grid item lg={3} md={2} sm={2} xs={12}></Grid>
          </Grid>

          {!this.state.showUpdatebtn ? (
            <Button
              className="textfield-spacing"
              type="submit"
              variant="contained"
              color="primary"
            >
              Add Blog Entry
            </Button>
          ) : (
            <Button
              className="textfield-spacing"
              type="submit"
              variant="contained"
              color="primary"
            >
              Update Blog Entry
            </Button>
          )}
          <br></br>
          {this.state.serviceAdded && (
            <SuccessModal
              open={this.state.modalOpen}
              handleClose={this.onModalClose}
              title="Blog added successfully!"
              message="The Blog details you have entered have been accepted and stored in the records accordingly.
          This window will close within 5 seconds"
            />
          )}
          {this.state.serviceUpdated && (
            <SuccessModal
              open={this.state.modalOpen}
              handleClose={this.onModalClose}
              title="Blog Updated successfully!"
              message="The Blog details you have updated have been stored in the records accordingly. 
          This window will close within 5 seconds"
            />
          )}
          {this.state.serviceDeleted && (
            <SuccessModal
              open={this.state.modalOpen}
              handleClose={this.onModalClose}
              title="Blog Deleted successfully!"
              message="The Blog record you chose has been deleted successfully from our records.
          This window will close within 5 seconds"
            />
          )}
        </form>
        <div className='dataGridContainer'>
          {this.state.blogs.length > 0 ? (
            <DataGrid
              className='my-data-grid'
              rows={rows}
              columns={columns}
              pageSize={5}

              // checkboxSelection
            />
          ) : this.state.blogs.length === 0 ? (
            <p>No blogs found</p>
          ) : (
            <p>Loading data...</p>
          )}
        </div>
      </div>
    );
  }
}
