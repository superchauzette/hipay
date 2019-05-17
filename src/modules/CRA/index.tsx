import React, { useState, useEffect, useMemo } from "react";
import { Flex, Heading, Box, Text, Button } from "rebass";
import { getCalendar } from "./getCalendar";
import { MonthSelector } from "../CommonUi/MonthSelector";
import { useUserContext } from "../UserHelper";
import { db } from "../App/fire";

type CalandarType = {
  nbOfday: number;
  day: Date;
  isWeekend: boolean;
  isJourFerie: boolean;
  dayOfWeek: string;
  cra?: number;
};

function getTotal(calendar: CalandarType[]): number {
  if (calendar.length === 0) return 0;

  const total = calendar
    .map(c => c.cra || 0)
    .reduce((a, b) => Number(a) + Number(b), 0);

  return Number(total);
}

function createTab(length) {
  return Array.from({ length }, (_, k) => k + 1);
}

export function CRA() {
  const user = useUserContext();
  const [month, setMonth] = useState(0);
  const [year, setYear] = useState(0);
  const [date, setDate] = useState();

  const [calendar, setCalendar] = useState([] as CalandarType[]);
  const total = useMemo(() => getTotal(calendar), [calendar]);

  useEffect(() => {
    getCalendar({ date, user, month, year }).then(setCalendar);
  }, [date, user, calendar]);

  async function changeCRA({ month, year }, selectedDate) {
    setMonth(month);
    setYear(year);
    setDate(selectedDate);
  }

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
      .doc("1")
      .set({ calendar });
  }

  // async function addCRA() {
  //   const newNbCRA = nbCRA + 1;
  //   const newCalendar = await getCalculatedCalendar(date);
  //   setCalendars(cs => [...cs, newCalendar]);

  //   await db()
  //     .collection(`users/${user.uid}/years/${year}/month/${month}/cra`)
  //     .doc(String(newNbCRA))
  //     .set({ calendar: newCalendar });
  //   setNbCRA(newNbCRA);
  // }

  return (
    <Flex p={3} flexDirection="column" alignItems="center">
      <Heading>Compte rendu d'Activité</Heading>
      <MonthSelector onChange={changeCRA} />

      <Flex pt={4} flexDirection="column">
        <Flex mb={3}>
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
        </Flex>
        <Box width={"96vw"}>
          <Flex justifyContent="space-between" flexWrap="wrap">
            {calendar.map(c => (
              <Box key={c.nbOfday} width={["56px", "32px"]} mb={3}>
                <Text
                  textAlign="center"
                  bg={c.isWeekend || c.isJourFerie ? "grey" : "white"}
                >
                  {c.dayOfWeek}
                </Text>
                <Text
                  textAlign="center"
                  bg={c.isWeekend || c.isJourFerie ? "grey" : "white"}
                >
                  {c.nbOfday}
                </Text>
                {!c.isWeekend && !c.isJourFerie && (
                  <input
                    type="text"
                    max="1"
                    style={{
                      width: "100%",
                      border: "none",
                      borderBottom: "1px solid gray",
                      outline: "none",
                      textAlign: "center"
                    }}
                    value={c.cra}
                    onChange={e => updateCRA(c.nbOfday, e.target.value)}
                  />
                )}
              </Box>
            ))}
          </Flex>
        </Box>
        <Box>
          <Button onClick={saveCRA}>Save</Button>
        </Box>
      </Flex>
    </Flex>
  );
}
