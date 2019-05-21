import React from "react";
import { Delete as DeleteIcon } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";

export function BtnDelete(props) {
  return (
    <IconButton aria-label="Delete" {...props}>
      <DeleteIcon />
    </IconButton>
  );
}
