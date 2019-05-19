import React from "react";
import { MyBox } from "../CommonUi/MyBox";
import { CalandarType } from "./CalandarType";

function bourage(calendar: CalandarType[], tabDays: string[]): number[] {
  if (!calendar.length) return [];

  const firstDay = calendar[0].dayOfWeek;
  const length = tabDays.indexOf(firstDay);
  return Array.from({ length }, (_, k) => k);
}

export function WhiteSpace({ calendar, tabDays }) {
  return (
    <>
      {bourage(calendar, tabDays).map(c => (
        <MyBox key={c} width={[1 / 7]} mb={3} display={["block", "none"]} />
      ))}
    </>
  );
}
