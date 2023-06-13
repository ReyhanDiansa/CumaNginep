import React from "react";
import GetUser from "./GetUser/getUser";
import withAuth from "../../withAuth";
import Drawer from "../../../components/Drawer";

const index = () => {
  return (
    <div style={{ display: "flex" }}>
      <div>
        <Drawer />
      </div>
      <div style={{margin:"3rem"}}>
      <GetUser />
      </div>
    </div>
  );
};

export default withAuth(index);
