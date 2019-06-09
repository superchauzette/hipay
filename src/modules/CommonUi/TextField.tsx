import React from "react";
import { TextField as TextFieldMd } from "@material-ui/core";
import { Flex } from "rebass";

export const TextField = ({ width = ["100%", "150px"] as any, ...props }) => (
  <Flex width={width}>
    <TextFieldMd
      style={{ marginRight: "10px", marginBottom: "10px", width: "100%" }}
      InputLabelProps={{ shrink: true }}
      {...props}
    />
  </Flex>
);
