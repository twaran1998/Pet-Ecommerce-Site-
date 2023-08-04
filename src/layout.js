import React, { useState } from "react";
import MyRoutes from "./MyRoutes";
import Sidebar from "./components/SideBar/Sidebar";

import "./App.css";

function Layout() {
  const [loggedIn, setloggedIn] = useState(false);

  const userObj = sessionStorage.getItem("userData");

  const isUserLogggedIn =
    userObj == null ? false : JSON.parse(userObj).isLoggedIn;


  return (
    <>
     
    <div className="layoutContainer">   
      {isUserLogggedIn ?  <Sidebar pageWrapId={'page-wrap'} outerContainerId={'outer-container'} /> : <></>}  
      <MyRoutes userLogged={isUserLogggedIn} />
    </div>
    </>
  );
}
export default Layout;
