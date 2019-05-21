import React from "react";
import { TextField as TextFieldMd } from "@material-ui/core";

export const TextField = props => (
  <TextFieldMd
    style={{ marginRight: "10px", marginBottom: "10px", width: "150px" }}
    InputLabelProps={{ shrink: true }}
    {...props}
  />
);
