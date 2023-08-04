import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import AddService from "./components/services/Addservices";
import Addblogs from "./components/blogs/Addblogs";
import NotFound from "./components/PageNotFound/PageNotFound";
// import Layout from "./layout";
import Dashboard from "./components/Dashboard/Dashboard";
import AddCategory from "./components/Categories/addCategory";
import AddPet from "./components/Pets/addPet";
import AddProduct from "./components/Products/addProduct";
import ViewOrders from "./components/Orders/ViewOrders";
// import SignUp from "./components/SignUp/signup";
import Login from "./components/login/login";
import Users from "./components/Users/users";
import Report from "./components/reports/report";
function MyRoutes(props) {
  const appUrl = process.env.REACT_APP_APIURL;
  const isUserLogggedIn = props.userLogged;
  const logoutFn = () => {
    alert("logotu");
  };

  return (
    <>
      <BrowserRouter>
        {/* <Layout> */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/logout" element={<Login logoutClick={true} />} />

          {/* <Route path="/home" element={<Dashboard/>}/> */}
          <Route
            path="/dashboard"
            element={
              isUserLogggedIn ? <Dashboard /> : <Navigate to="/NotFound" />
            }
          />
          <Route
            path="/users"
            element={
              isUserLogggedIn ? (
                <Users apiUrl={appUrl} />
              ) : (
                <Navigate to="/NotFound" />
              )
            }
          />
          <Route
            path="/blogs"
            element={
              isUserLogggedIn ? (
                <Addblogs apiUrl={appUrl} />
              ) : (
                <Navigate to="/NotFound" />
              )
            }
          />

          <Route
            path="/services"
            element={
              isUserLogggedIn ? (
                <AddService apiUrl={appUrl} />
              ) : (
                <Navigate to="/NotFound" />
              )
            }
          />

          <Route
            path="/category"
            element={
              isUserLogggedIn ? (
                <AddCategory apiUrl={appUrl} />
              ) : (
                <Navigate to="/NotFound" />
              )
            }
          />
          <Route
            path="/pets"
            element={
              isUserLogggedIn ? (
                <AddPet apiUrl={appUrl} />
              ) : (
                <Navigate to="/NotFound" />
              )
            }
          />

          <Route
            path="/products"
            element={
              isUserLogggedIn ? (
                <AddProduct apiUrl={appUrl} />
              ) : (
                <Navigate to="/NotFound" />
              )
            }
          />
            <Route
            path="/getOrders"
            element={
              isUserLogggedIn ? (
                <ViewOrders apiUrl={appUrl} />
              ) : (
                <Navigate to="/NotFound" />
              )
            }
          />

          <Route
            path="/report"
            element={
              isUserLogggedIn ? (
                <Report apiUrl={appUrl} />
              ) : (
                <Navigate to="/NotFound" />
              )
            }
          />
          <Route path="/NotFound" component={NotFound} />
        </Routes>
        {/* </Layout> */}
      </BrowserRouter>
    </>
  );
}

export default MyRoutes;
