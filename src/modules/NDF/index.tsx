import React from "react";
import { Flex, Heading, Text } from "rebass";
import { MonthSelector } from "../CommonUi/MonthSelector";
import { Header } from "../CommonUi/Header";
import { PageWrapper } from "../CommonUi/PageWrapper";

export function NoteDeFrais() {
  function changeCRA() {}

  return (
    <PageWrapper>
      <Header
        title="Note de Frais"
        prevLink={{ to: "/", label: "dash" }}
        nextLink={{ to: "/ndf", label: "ndf" }}
      />
      <MonthSelector onChange={changeCRA} />
    </PageWrapper>
  );
}
