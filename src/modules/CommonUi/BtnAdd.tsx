import React from "react";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import { CircularProgress } from "@material-ui/core";
import { MyBox } from "./MyBox";

export function BtnAdd(props) {
  return (
    <MyBox
      position="fixed"
      style={{ right: "30px", bottom: "70px" }}
      {...props}
    >
      <Fab
        aria-label="Add"
        onClick={props.loading ? () => {} : props.onClick}
        style={{ backgroundColor: "#07c", color: "white" }}
      >
        {props.loading ? <CircularProgress /> : <AddIcon />}
      </Fab>
    </MyBox>
  );
}
