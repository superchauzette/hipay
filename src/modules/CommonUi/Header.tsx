import React from "react";
import { Flex, Heading } from "rebass";

type HeaderProps = {
  title: string;
};

export function Header({ title }: HeaderProps) {
  return (
    <Flex justifyContent="space-around" width={1}>
      <Heading fontSize={3} mb={2} color="black">
        {title}
      </Heading>
    </Flex>
  );
}
