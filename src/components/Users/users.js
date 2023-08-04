import { Component } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { TextField, Button, Input, Grid } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { Select, MenuItem, Alert } from "@mui/material";
import { Form } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";

export default class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {  
      users:[]
    };
  }

  async fetchUsers() {
    try {
        let res = await fetch(`${this.props.apiUrl}/api/getUsers`,{
        method: "GET",
        headers: new Headers({ "content-type": "application/json" }),
      });
      let resJson = await res.json();
      console.log("FETCHED UERS", resJson);
      if (res.status === 200) {
        this.setState({ users: resJson});
      } else {
        console.log("users not fetched");
      }
    } catch (err) {
      console.log(err);
    }
  }

  componentDidMount() {
    this.fetchUsers();
  }

  render() {
    const columns = [
      { field: "userName", headerName: "User Name", flex: 1 },
      { field: "firstName", headerName: "First Name", flex: 1 },
        { field: "userRole", headerName: "Role", flex: 1 },
        // { field: "email", headerName: "Email", flex: 1 },
      { field: "isUserActive", headerName: "isUserActive", flex: 1 },
      {
        field: "delete",
        headerName: "Delete",
        width: 100,
        renderCell: (params) => (
          <IconButton
            color="secondary"
          >
            <DeleteIcon />
          </IconButton>
        ),
      },
    ];
    return (
      <div className="container">
        <form >
          <h1 className="Title">Users</h1>
          <h5>Purpose - To getlist of users in Admin/Customer</h5>
         <div style={{height:'100%',width:'100%'}}>
          {this.state.users.length > 0 ? (
            <DataGrid
              width={400} height={300}
              rowHeight={40}
              rows={this.state.users.map((user) => ({
                id: user._id,
                userName: user.userName,
                firstName: user.firstName,
                userRole : user.userRole === 2 ? 'Customer' : 'Admin',
                email: user.serviceImg,
                isUserActive : user.isUserActive
              }))}
              columns={columns}
              pageSize={20}
              rowsPerPageOptions={[5]}
              checkboxSelection
            />
          ) : (
            <p>Loading data...</p>
          )}
        </div>
        </form>
        </div>
    );
  }
}
