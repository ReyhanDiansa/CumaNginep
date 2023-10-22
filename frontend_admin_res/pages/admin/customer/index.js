import React from "react";
import GetCustomer from "./GetCustomer";
import Drawer from "../../../components/Drawer";
import withAuth from "../../withAuth";

const index = () => {
  return (
    <div style={{ display: "flex" }}>
      <div>
        <Drawer />
      </div>
      <div style={{margin:"3rem"}}>
        <GetCustomer/>
      </div>
    </div>
  );
};

export default withAuth(index);
