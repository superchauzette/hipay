import React from "react";
import { Link } from "react-router-dom";
import { Flex, Heading } from "rebass";

type HeaderProps = {
  title: string;
  prevLink: {
    to: string;
    label: string;
  };
  nextLink: {
    to: string;
    label: string;
  };
};

export function Header({ title, prevLink, nextLink }: HeaderProps) {
  return (
    <Flex alignItems="center">
      <Link to={prevLink.to}>{prevLink.label}</Link>
      <Heading textAlign="center" fontSize={3} mx={3}>
        {title}
      </Heading>
      <Link to={nextLink.to}>{nextLink.label}</Link>
    </Flex>
  );
}
