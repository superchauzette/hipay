import React, { useEffect, useState } from "react";
import format from "date-fns/format";
import dateFns from "date-fns";
import addYears from "date-fns/add_years";
import frLocale from "date-fns/locale/fr";
import { Text, Flex } from "rebass";
import LeftIcon from "@material-ui/icons/KeyboardArrowLeftRounded";
import RightIcon from "@material-ui/icons/KeyboardArrowRightRounded";
import { IconButton } from "@material-ui/core";

export type YearSelectorProps = {
  onChange: (dateFormatted: any, date: any) => void;
};

const today = new Date();
const formatDate = (date: Date) => format(date, "YYYY", { locale: frLocale });

export function getYear(date: Date) {
  return {
    year: Number(dateFns.getYear(date))
  };
}

function YearSelectorComp({ onChange }: YearSelectorProps) {
  const [index, setIndex] = React.useState(0);
  const date = addYears(today, index);

  useEffect(() => {
    onChange(getYear(date), date);
  }, [index, date, onChange]);

  function addYear() {
    setIndex(index => index + 1);
  }

  function subYear() {
    setIndex(index => index - 1);
  }

  return (
    <Flex alignItems="center" color="black" mb={1}>
      <IconButton onClick={subYear} style={{ outline: "none" }}>
        <LeftIcon style={{ fontSize: "27px" }} />
      </IconButton>
      <Text mx={2} color="black" width="160px" textAlign="center">
        {formatDate(date)}
      </Text>
      <IconButton onClick={addYear} style={{ outline: "none" }}>
        <RightIcon style={{ fontSize: "27px" }} />
      </IconButton>
    </Flex>
  );
}

export const YearSelector = React.memo(YearSelectorComp, () => true);

export function useYearChange() {
  const [year, setYear] = useState(0);
  const [date, setDate] = useState(new Date());

  async function handleChangeYear({ year }, selectedDate: Date) {
    setYear(year);
    setDate(selectedDate);
  }

  return { year, date, handleChangeYear };
}
