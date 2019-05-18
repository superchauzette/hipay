import React from "react";
import { Flex, Heading, Text } from "rebass";
import { MonthSelector, useDateChange } from "../CommonUi/MonthSelector";
import { Header } from "../CommonUi/Header";
import { PageWrapper } from "../CommonUi/PageWrapper";

export function NoteDeFrais() {
  const { handleChangeMonth } = useDateChange();

  return (
    <PageWrapper>
      <Header
        title="Note de Frais"
        prevLink={{ to: "/cra", label: "cra" }}
        nextLink={{ to: "/ik", label: "ik" }}
      />
      <MonthSelector onChange={handleChangeMonth} />
    </PageWrapper>
  );
}
