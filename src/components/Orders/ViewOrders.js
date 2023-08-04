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
      orders: [],
    };
  }
  //Get Address in required format
  getAddress = (address) => {
    const address1 = address.Address; //Address
    const address2 = address.City; //Toronto
    const province = address.Province; //ON
    const postal = address.Postal; //N2L2X1
    const country = address.CountryCode; //CA

    const userAddress =
      address1 +
      ", " +
      address2 +
      ", " +
      province +
      ", " +
      postal +
      ", " +
      country;
    return userAddress;
  };

  //Get Date in Toronto timeZone
  calculateOrderDate = (dateFromDb) => {
    // create a new Date object with the current UTC time
    const utcDate = new Date(dateFromDb);

    // get the offset in minutes between UTC and Toronto time
    const torontoOffset = 1 // Eastern Time Zone is UTC-5

    // calculate the total number of milliseconds to add to the UTC time
    const totalOffset = torontoOffset * 1000 * 60;

    // create a new Date object with the Toronto time
    const torontoDate = new Date(utcDate.getTime() + totalOffset);

    // format the Toronto time as a string
    const torontoTimeString = torontoDate.toLocaleString("en-US", {
      timeZone: "America/Toronto",
    });

    console.log("UTC time: ", utcDate.toISOString());
    console.log("Toronto time: ", torontoTimeString);
    return torontoTimeString;
  };

  async fetchOrders() {
    try {
      let res = await fetch(`${this.props.apiUrl}/api/getOrders`, {
        method: "GET",
        headers: new Headers({ "content-type": "application/json" }),
      });
      let resJson = await res.json();
      console.log("FETCHED ORders", resJson);
      if (res.status === 200) {
        this.setState({ orders: resJson });
      } else {
        console.log("Orders not fetched");
      }
    } catch (err) {
      console.log(err);
    }
  }

  componentDidMount() {
    this.fetchOrders();
  }

  render() {
    const columns = [
      // { field: "userName", headerName: "Name", flex: 0 },
      { field: "userEmail", headerName: "User Email", flex: 1 },
      { field: "transStatus", headerName: "Transaction Status", flex: 1 },
      { field: "orderNo", headerName: "Order #", flex: 0 },
      { field: "orderPlacedAt", headerName: "Order Date", flex: 1 },
      // { field: "email", headerName: "Email", flex: 1 },
      { field: "orderTotal", headerName: "Order Total", flex: 0 },
      { field: "address", headerName: "Address", flex: 2 },
    ];
    return (
      <div className="container">
        <form>
        <h1 className="Title">Customer Orders</h1>
          <h5>Purpose - To get Customer orders</h5>
          <div style={{ height: "100%", width: "100%" }}>
            {this.state.orders.length > 0 ? (
              <DataGrid
                width={400}
                height={300}
                rowHeight={40}
                rows={this.state.orders.map((order) => ({
                  id: order._id,
                  // userName: order.fullName,
                  userEmail: order.userEmail,
                  transStatus: order.status,
                  orderNo: order.swagimalsOrderId,
                  orderPlacedAt: this.calculateOrderDate(order.createdAt),
                  orderTotal: order.orderTotal,
                  address: this.getAddress(order.address),
                }))}
                columns={columns}
                pageSize={20}
                rowsPerPageOptions={[5]}
                // checkboxSelection
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
