import React from "react";
import { Flex, Text } from "rebass";
import { Card } from "../CommonUi/Card";

export function Dashboard() {
  return (
    <Flex flexDirection="column" p={3} alignItems="center">
      <Card p={3}>
        <Text textAlign="center">Work in Progress</Text>
      </Card>
    </Flex>
  );
}
