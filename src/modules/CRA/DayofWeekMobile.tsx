import React from "react";
import { Text } from "rebass";
import { MyBox } from "../CommonUi";

type DayofWeekMobileProps = {
  tabDays: string[];
};

export function DayofWeekMobile({ tabDays }: DayofWeekMobileProps) {
  return (
    <>
      {tabDays.map(day => (
        <MyBox
          key={day}
          width={[1 / 7]}
          display={["flex", "none"]}
          style={{ justifyContent: "center" }}
        >
          <Text
            textAlign="center"
            p={"10px"}
            color={["sa", "di"].includes(day) ? "grey" : "black"}
            fontWeight={["sa", "di"].includes(day) ? "bold" : "normal"}
          >
            {day}
          </Text>
        </MyBox>
      ))}
    </>
  );
}
