import React, { useContext, useEffect } from "react";
import { CardHeader, CardContent, Card } from "@material-ui/core";
import { CardDisplayNumber } from "../CommonUi/CardDisplayNumber";
import { formatNumber } from "./DisplayData";
import { Box } from "rebass";
import { FiscValue } from "../User/FiscAdmin";
import dayjs from "dayjs";
import { map } from "lodash";
import { useUserContext } from "../UserHelper";
import { InColor } from "../CommonUi/InColor";

const getSentence = (fiscValue: FiscValue) => {
  const { type, disable, amount, date } = fiscValue;
  switch (type) {
    case "AFFILIATION":
      return "En cours d'affiliation.";
    case "AMOUNT":
      if (date && amount)
        return `Echéance du ${dayjs(date).format(
          "DD/MM/YYYY"
        )} de ${formatNumber(amount)} €`;
    case "MENSUEL":
      return "Prélevement mis en place.";
  }
};

const FiscBlock = ({ value, label }: { value: FiscValue; label: string }) => (
  <Box p={3} width={[1, 1, 1]}>
    <CardDisplayNumber valueVariant="subtitle1" title={label}>
      {getSentence(value)}
    </CardDisplayNumber>
  </Box>
);

export function Fisc({}) {
  const currentUser = useUserContext();

  return (
    <>
      {currentUser && (
        <Card>
          <CardHeader
            style={{ textAlign: "center" }}
            title={
              <>
                <InColor color="red">F</InColor>isc &{" "}
                <InColor color="red">s</InColor>ocial
              </>
            }
          />
          <CardContent>
            {map(currentUser.fisc, (value: FiscValue, key: string) => (
              <>
                {!value.disable && (
                  <FiscBlock key={key} value={value} label={key} />
                )}
              </>
            ))}
          </CardContent>
        </Card>
      )}
    </>
  );
}
