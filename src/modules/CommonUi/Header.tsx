import React from "react";
import { Flex, Heading } from "rebass";

type HeaderProps = {
  title: string;
};

export function Header({ title }: HeaderProps) {
  return (
    <Flex justifyContent="space-around" width={1}>
      <Heading fontSize={3} mb={4} color="rgb(72, 72, 72)">
        {title}
      </Heading>
    </Flex>
  );
}
