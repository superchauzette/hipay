import React from "react";
import { Text } from "rebass";
import { MyBox } from "../CommonUi/MyBox";

export function DayofWeekMobile({ tabDays }) {
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
            bg={["sa", "di"].includes(day) ? "grey" : "white"}
            style={{ borderRadius: "50%", height: "95%" }}
            width={9 / 10}
          >
            {day}
          </Text>
        </MyBox>
      ))}
    </>
  );
}
