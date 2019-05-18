import React, { useEffect, useState } from "react";
import format from "date-fns/format";
import addMonths from "date-fns/add_months";
import frLocale from "date-fns/locale/fr";
import { Button, Text, Flex } from "rebass";

export type MonthSelectorProps = {
  onChange: (dateFormatted: any, date: any) => void;
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

const today = new Date();

function MonthSelectorComp({ onChange }: MonthSelectorProps) {
  const [index, setIndex] = React.useState(0);
  const date = addMonths(today, index);

  useEffect(() => {
    onChange(formatDateOut(date), date);
  }, [index, date, onChange]);

  function addMonth() {
    setIndex(index => index + 1);
  }

  function subMonth() {
    setIndex(index => index - 1);
  }

  return (
    <Flex alignItems="center">
      <Button onClick={subMonth}>{"<"}</Button>
      <Text mx={2}>{formatDate(date)}</Text>
      <Button onClick={addMonth}> {">"} </Button>
    </Flex>
  );
}

export const MonthSelector = React.memo(MonthSelectorComp, () => true);

export function useDateChange() {
  const [month, setMonth] = useState(0);
  const [year, setYear] = useState(0);
  const [date, setDate] = useState(new Date());

  async function handleChangeMonth({ month, year }, selectedDate: Date) {
    setMonth(month);
    setYear(year);
    setDate(selectedDate);
  }

  return { month, year, date, handleChangeMonth };
}
