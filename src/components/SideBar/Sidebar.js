import React, { useState, useEffect } from "react";

import "./sidebar.css";

import SidebarData from "./SidebarData";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Divider from "@mui/material/Divider";

import { slide as Menu } from "react-burger-menu";

function Sidebar() {
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    function handleResize() {
      setShowMenu(window.innerWidth < 768);
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const clearSession = () => {
    sessionStorage.removeItem("userData");
    alert("Logout successful");
  };
  return (
    <>
      {showMenu ? (
        <Menu>
          <div className="Sidebar">
            <div className="adminInfo">
              <div className="sidebarAdminVals">
                <li className="adminSideTagLine" id="title">
                  Welcome to Swagimals{" "}
                </li>
                <li className="adminSideBarImg">
                  <AccountCircleIcon />
                </li>
                <li className="sidebarAdminData sidebarAdminName">
                  <div id="icon"> User </div> :{" "}
                  <div id="title">
                    {" "}
                    {sessionStorage.userData == undefined ||
                    sessionStorage.userData == null
                      ? "Admin"
                      : JSON.parse(sessionStorage.userData).username}
                  </div>
                </li>
                <li className="sidebarAdminData sidebarAdminRole">
                  {" "}
                  <div id="icon"> Role</div> : <div id="title"> Admin</div>
                </li>
              </div>
            </div>
            <Divider className="whiteDivider" light={false} />
            <ul className="sidebarList">
              {SidebarData.map((val, key) => {
                return (
                  <li
                    key={key}
                    id={window.location.pathname === val.link ? "active" : ""}
                    className="sidebarRow"
                    onClick={() => {
                      window.location.pathname = val.link;
                      if (val.link == "/logout") {
                        clearSession();
                      }
                    }}
                  >
                    {" "}
                    <div id="icon"> {val.icon}</div>{" "}
                    <div id="title"> {val.title}</div>
                  </li>
                );
              })}
            </ul>
          </div>
        </Menu>
      ) : (
        <div className="Sidebar">
          <div className="adminInfo">
            <div className="sidebarAdminVals">
              <li className="adminSideTagLine" id="title">
                Welcome to Swagimals{" "}
              </li>
              <li className="adminSideBarImg">
                <AccountCircleIcon />
              </li>
              <li className="sidebarAdminData sidebarAdminName">
                <div id="icon"> User </div> :{" "}
                <div id="title">
                  {" "}
                  {sessionStorage.userData == undefined ||
                  sessionStorage.userData == null
                    ? "Admin"
                    : JSON.parse(sessionStorage.userData).username}
                </div>
              </li>
              <li className="sidebarAdminData sidebarAdminRole">
                {" "}
                <div id="icon"> Role</div> : <div id="title"> Admin</div>
              </li>
            </div>
          </div>
          <Divider className="whiteDivider" light={false} />
          <ul className="sidebarList">
            {SidebarData.map((val, key) => {
              return (
                <li
                  key={key}
                  id={window.location.pathname === val.link ? "active" : ""}
                  className="sidebarRow"
                  onClick={() => {
                    window.location.pathname = val.link;
                    if (val.link == "/logout") {
                      clearSession();
                    }
                  }}
                >
                  {" "}
                  <div id="icon"> {val.icon}</div>{" "}
                  <div id="title"> {val.title}</div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}

export default Sidebar;
