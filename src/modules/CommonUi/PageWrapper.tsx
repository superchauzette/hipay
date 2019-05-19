import React from "react";
import { Flex } from "rebass";

export function PageWrapper(props) {
  return (
    <Flex p={[3, 3]} flexDirection="column" alignItems="center" {...props} />
  );
}
