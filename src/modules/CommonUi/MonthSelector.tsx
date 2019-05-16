import React from "react";
import format from "date-fns/format";
import addMonths from "date-fns/add_months";
import frLocale from "date-fns/locale/fr";
import { Button } from "rebass";

export function MonthSelector() {
  const [index, setIndex] = React.useState(0);
  const date = addMonths(new Date(), index);

  function addMonth() {
    setIndex(index => index + 1);
  }

  function subMonth() {
    setIndex(index => index - 1);
  }

  return (
    <div>
      <Button onClick={subMonth}> - </Button>
      {format(date, "MMMM YYYY", { locale: frLocale })}
      <Button onClick={addMonth}> + </Button>
    </div>
  );
}
