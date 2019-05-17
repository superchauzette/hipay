import React, { useEffect } from "react";
import format from "date-fns/format";
import addMonths from "date-fns/add_months";
import frLocale from "date-fns/locale/fr";
import { Button, Text, Flex } from "rebass";

export type MonthSelectorProps = {
  onChange?: (date: any) => void;
};

const formatDate = date => format(date, "MMMM YYYY", { locale: frLocale });
const formatDateOut = date => {
  const dateFormatted = format(date, "MM YYYY", { locale: frLocale });
  const [month, year] = dateFormatted.split(" ");
  return {
    month: Number(month),
    year: Number(year)
  };
};

export function MonthSelector({ onChange = () => {} }: MonthSelectorProps) {
  const [index, setIndex] = React.useState(0);
  const date = addMonths(new Date(), index);
  useEffect(() => {
    onChange(formatDateOut(date));
  }, [date]);

  function addMonth() {
    setIndex(index => index + 1);
  }

  function subMonth() {
    setIndex(index => index - 1);
  }

  return (
    <Flex>
      <Button onClick={subMonth}>{"<"}</Button>
      <Text>{formatDate(date)}</Text>
      <Button onClick={addMonth}> {">"} </Button>
    </Flex>
  );
}
