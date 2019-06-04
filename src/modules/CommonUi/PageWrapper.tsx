import React from "react";
import { Flex } from "rebass";

export function PageWrapper(props) {
  return (
    <Flex
      px={3}
      pt={3}
      pb={3}
      flexDirection="column"
      alignItems="center"
      {...props}
    />
  );
}
