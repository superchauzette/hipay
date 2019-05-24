import React from "react";
import { TextField as TextFieldMd } from "@material-ui/core";
import { Flex } from "rebass";

export const TextField = ({ ...props }) => (
  <Flex width={["100%", "150px"]}>
    <TextFieldMd
      style={{ marginRight: "10px", marginBottom: "10px", width: "100%" }}
      InputLabelProps={{ shrink: true }}
      {...props}
    />
  </Flex>
);
