import React from "react";
import { Flex, Heading, Text } from "rebass";

export function CRA() {
  return (
    <Flex p={3} flexDirection="column" alignItems="center">
      <Heading>Charges</Heading>
      <Text>Février 2019</Text>
      <Flex pt={4}>
        <input type="text" placeholder="Nom du client" />
      </Flex>
    </Flex>
  );
}
