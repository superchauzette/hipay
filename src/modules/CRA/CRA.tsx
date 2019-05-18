import React, { useState, useEffect } from "react";
import { Flex, Box, Text, Button } from "rebass";
import { display, width, space } from "styled-system";
import { getCalendar } from "./getCalendar";
import { userType } from "../UserHelper";
import { db } from "../App/fire";
import styled from "styled-components";

const MyBox: any = styled.div`
  ${display}
  ${width}
  ${space}
`;

type CRAProps = {
  id: string;
  date: Date;
  month: number;
  year: number;
  user: userType;
  showTrash: boolean;
  onDelete: (id: string) => void;
};

type CalandarType = {
  nbOfday: number;
  day: Date;
  isWeekend: boolean;
  isJourFerie: boolean;
  dayOfWeek: string;
  cra?: number;
};

const tabDays = ["lu", "ma", "me", "je", "ve", "sa", "di"];

function getTotal(calendar: CalandarType[]): number {
  if (calendar.length === 0) return 0;

  const total = calendar
    .map(c => c.cra || 0)
    .reduce((a, b) => Number(a) + Number(b), 0);

  return Number(total);
}

function bourage(calendar: CalandarType[]): number[] {
  if (!calendar.length) return [];

  const firstDay = calendar[0].dayOfWeek;
  const length = tabDays.indexOf(firstDay);
  return Array.from({ length }, (_, k) => k);
}

function WhiteSpace({ calendar }) {
  return (
    <Box>
      {bourage(calendar).map(c => (
        <MyBox key={c} width={[1 / 7]} mb={3} display={["block", "none"]} />
      ))}
    </Box>
  );
}

function DayofWeekMobile() {
  return (
    <Flex width={1}>
      {tabDays.map(day => (
        <MyBox key={day} width={[1 / 7]} mb={3} display={["block", "none"]}>
          <Text
            textAlign="center"
            bg={["sa", "di"].includes(day) ? "grey" : "white"}
          >
            {day}
          </Text>
        </MyBox>
      ))}
    </Flex>
  );
}

export function CRA({
  id,
  showTrash,
  date,
  month,
  year,
  user,
  onDelete
}: CRAProps) {
  const [calendar, setCalendar] = useState([] as CalandarType[]);
  const total = getTotal(calendar);

  console.log(calendar);

  useEffect(() => {
    getCalendar({ id, date, user, month, year }).then(setCalendar);
  }, [date, month, year, user, id]);

  function fillAll() {
    setCalendar(calendar =>
      calendar.map(c => (!c.isWeekend && !c.isJourFerie ? { ...c, cra: 1 } : c))
    );
  }

  function updateCRA(nbOfday: number, value: string) {
    setCalendar(calendar =>
      calendar.map(c =>
        c.nbOfday === nbOfday ? { ...c, cra: Number(value) } : c
      )
    );
  }

  async function saveCRA() {
    await db()
      .collection(`users/${user.uid}/years/${year}/month/${month}/cra`)
      .doc(String(id))
      .set({ calendar });
  }

  async function deleteCRA() {
    onDelete(id);
    await db()
      .collection(`users/${user.uid}/years/${year}/month/${month}/cra`)
      .doc(String(id))
      .delete();
  }

  return (
    <Flex pt={4} flexDirection="column">
      <Flex mb={3} flexWrap="wrap">
        <input
          type="text"
          placeholder="Nom du client"
          style={{
            border: "none",
            borderBottom: "1px solid gray",
            outline: "none"
          }}
        />
        <Button mx={3} onClick={fillAll}>
          Fill All
        </Button>

        <Text>Total : {total}</Text>

        {showTrash && (
          <Button mx={3} onClick={deleteCRA}>
            Poubelle
          </Button>
        )}
      </Flex>
      <Box width={["100%", "96vw"]} mt={4}>
        <Flex justifyContent={["flex-start", "space-between"]} flexWrap="wrap">
          <DayofWeekMobile />
          <WhiteSpace calendar={calendar} />

          {calendar.map(c => (
            <Box
              key={`${id}-${month}-${year}-${c.nbOfday}`}
              width={[1 / 7, "32px"]}
              mb={3}
            >
              <MyBox display={["none", "block"]}>
                <Text
                  textAlign="center"
                  bg={c.isWeekend || c.isJourFerie ? "grey" : "white"}
                >
                  {c.dayOfWeek}
                </Text>
              </MyBox>
              <Text
                textAlign="center"
                bg={c.isWeekend || c.isJourFerie ? "grey" : "white"}
              >
                {c.nbOfday}
              </Text>

              <input
                key={`${id}-${month}-${year}-${c.nbOfday}-${c.dayOfWeek}`}
                type="text"
                style={{
                  width: "100%",
                  border: "none",
                  borderBottom: "1px solid gray",
                  outline: "none",
                  textAlign: "center"
                }}
                value={c.cra}
                onChange={e => updateCRA(c.nbOfday, e.target.value)}
                disabled={c.isWeekend || c.isJourFerie}
              />
            </Box>
          ))}
        </Flex>
      </Box>
      <Box>
        <Button onClick={saveCRA}>Save</Button>
      </Box>
    </Flex>
  );
}
