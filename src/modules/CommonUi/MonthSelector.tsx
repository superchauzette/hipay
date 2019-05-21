import React, { useEffect, useState } from "react";
import format from "date-fns/format";
import addMonths from "date-fns/add_months";
import frLocale from "date-fns/locale/fr";
import { Text, Flex } from "rebass";
import LeftIcon from "@material-ui/icons/KeyboardArrowLeftRounded";
import RightIcon from "@material-ui/icons/KeyboardArrowRightRounded";
import { IconButton } from "@material-ui/core";

export type MonthSelectorProps = {
  onChange: (dateFormatted: any, date: any) => void;
};

const today = new Date();
const formatDate = (date: Date) =>
  format(date, "MMMM YYYY", { locale: frLocale });
function formatDateOut(date: Date) {
  const dateFormatted = format(date, "MM YYYY", { locale: frLocale });
  const [month, year] = dateFormatted.split(" ");
  return {
    month: Number(month),
    year: Number(year)
  };
}

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
    <Flex alignItems="center" color="black">
      <IconButton onClick={subMonth} style={{ outline: "none" }}>
        <LeftIcon style={{ fontSize: "27px" }} />
      </IconButton>
      <Text mx={2} color="black" width="160px" textAlign="center">
        {formatDate(date)}
      </Text>
      <IconButton onClick={addMonth} style={{ outline: "none" }}>
        <RightIcon style={{ fontSize: "27px" }} />
      </IconButton>
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
