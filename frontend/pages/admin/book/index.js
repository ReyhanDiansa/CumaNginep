import Drawer from "../../../components/Drawer";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import AutomaticBook from "./AutomaticBook";
import ManualBook from "./ManualBook"


const index = () => {
  const [manual, setManual] = useState(false);
  const [otomatis, setOtom] = useState(false);

  const ManualsBook=()=>{
    setManual(true)
    setOtom(false)
  }
  const AutomaticsBook=()=>{
    setOtom(true)
    setManual(false)
  }
  return (
    <div style={{ display: "flex" }}>
      <div>
        <Drawer />
      </div>
      <div >
        <div style={{ display: "flex", gap:"20px", marginLeft:"2rem" }}>
          <Button
            variant="outlined"
            onClick={ ManualsBook}
            sx={{
              marginTop: "2rem",
              color: "#024f79",
              borderColor: "#024f79",
              "&:hover": {
                color: "#024f79",
                borderColor: "#024f79",
                backgroundColor: "#024f7911",
              },
            }}
          >
            Manual Book
          </Button>
          <Button
            variant="outlined"
            onClick={AutomaticsBook}
            sx={{
              marginTop: "2rem",
              color: "#024f79",
              borderColor: "#024f79",
              "&:hover": {
                color: "#024f79",
                borderColor: "#024f79",
                backgroundColor: "#024f7911",
              },
            }}
          >
            Automatic Book
          </Button>
        </div>
        <div>
            {
                manual && (
                    <ManualBook/>
                )
            }
            {
                otomatis && (
                    <AutomaticBook />
                )
            }
        </div>
      </div>
    </div>
  );
};

export default index;
