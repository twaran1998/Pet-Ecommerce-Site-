import React from "react";
import TopStats from "./TopStats";
// import { logoutFn } from "../../utilityFn/logoutFn";
function Dashboard() {
  return (
    <div>
      {/* <div>
        <button onClick={logoutFn}>Logout</button>
      </div> */}
      <TopStats />
    </div>
  );
}

export default Dashboard;
