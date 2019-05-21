import React from "react";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";

export function BtnAdd(props) {
  return (
    <Fab
      aria-label="Add"
      style={{
        position: "fixed",
        bottom: "30px",
        right: "30px",
        backgroundColor: "#07c",
        color: "white"
      }}
      {...props}
    >
      <AddIcon />
    </Fab>
  );
}
