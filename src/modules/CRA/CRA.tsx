import React, { useState, useEffect } from "react";
import { Flex, Box, Text, Button } from "rebass";
import { display, width, space } from "styled-system";
import { Delete as DeleteIcon } from "@material-ui/icons";
import { getCraFirebase, getCalculatedCalendar } from "./service";
import { userType } from "../UserHelper";
import { db } from "../App/fire";
import styled from "styled-components";
import { Card } from "../CommonUi/Card";

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
    <>
      {bourage(calendar).map(c => (
        <MyBox key={c} width={[1 / 7]} mb={3} display={["block", "none"]} />
      ))}
    </>
  );
}

function DayofWeekMobile() {
  return (
    <>
      {tabDays.map(day => (
        <MyBox key={day} width={[1 / 7]} mb={3} display={["block", "none"]}>
          <Text
            textAlign="center"
            p={"10px"}
            bg={["sa", "di"].includes(day) ? "grey" : "white"}
          >
            {day}
          </Text>
        </MyBox>
      ))}
    </>
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
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [client, setClient] = useState("");
  const [commentaire, setCommentaire] = useState("");
  const total = getTotal(calendar);

  async function init() {
    const calendarCal = await getCalculatedCalendar(date);
    setCalendar(calendarCal);

    const craData = await getCraFirebase(id, user, month, year);
    if (craData) {
      if (craData.calendar) setCalendar(craData.calendar);
      setIsSaved(craData.isSaved);
      setClient(craData.client);
    }
  }

  useEffect(() => {
    init();
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
    setIsSaved(save => !save);
    if (!isSaved) {
      setLoading(true);
      await db()
        .collection(`users/${user.uid}/years/${year}/month/${month}/cra`)
        .doc(String(id))
        .set({ calendar, isSaved: true, client, commentaire });
      setLoading(false);
    }
  }

  async function deleteCRA() {
    onDelete(id);
    await db()
      .collection(`users/${user.uid}/years/${year}/month/${month}/cra`)
      .doc(String(id))
      .delete();
  }

  function saveClient(e) {
    const value = e.target.value;
    setClient(value);
    localStorage.setItem(`client-${id}`, value);
  }

  return (
    <Card width={1} p={3}>
      <Flex flexDirection="column">
        <Flex mt={3}>
          <input
            type="text"
            placeholder="Nom du client"
            style={{
              border: "none",
              borderBottom: "1px solid #80808063",
              outline: "none",
              backgroundColor: "transparent",
              fontSize: "18px",
              fontWeight: "bold"
            }}
            value={client}
            onChange={saveClient}
            disabled={isSaved}
          />
          <Box m="auto" />
          {showTrash && (
            <Button bg="red" onClick={deleteCRA}>
              <DeleteIcon />
            </Button>
          )}
        </Flex>

        <Flex mt={3} alignItems="center">
          {!isSaved && <Button onClick={fillAll}>Fill All</Button>}
          <Box m="auto" />
          <Flex alignItems="center">
            <Text mx={1}>Total :</Text>
            <Text fontWeight={"bold"} fontSize={3}>
              {total}
            </Text>
          </Flex>
        </Flex>

        <Box width={["100%"]} mt={2}>
          <Flex
            justifyContent={["flex-start", "flex-start", "space-between"]}
            flexWrap={["wrap", "wrap", "nowrap"]}
          >
            <DayofWeekMobile />
            <WhiteSpace calendar={calendar} />

            {calendar.map(c => (
              <Box
                key={`${id}-${month}-${year}-${c.nbOfday}`}
                width={[1 / 7, "40px", 1]}
                mb={3}
                bg={c.isWeekend || c.isJourFerie ? "grey" : "white"}
              >
                <MyBox display={["none", "block"]}>
                  <Text textAlign="center">{c.dayOfWeek}</Text>
                </MyBox>
                <Text textAlign="center" pt={1}>
                  {c.nbOfday}
                </Text>
                <Box pt={1}>
                  <input
                    key={`${id}-${month}-${year}-${c.nbOfday}-${c.dayOfWeek}`}
                    type="number"
                    max="1"
                    min="0"
                    step="0.5"
                    name="craValue"
                    style={{
                      width: "100%",
                      height: "30px",
                      border: "none",
                      borderBottom: "1px solid gray",
                      outline: "none",
                      textAlign: "center"
                    }}
                    value={c.cra}
                    onChange={e => updateCRA(c.nbOfday, e.target.value)}
                    disabled={c.isWeekend || c.isJourFerie || isSaved}
                  />
                </Box>
              </Box>
            ))}
          </Flex>
        </Box>
        <Flex width={[1, "40%"]} mt={1}>
          <textarea
            placeholder="Commentaire, astreintes"
            style={{ width: "100%", height: "120px", padding: "5px" }}
            value={commentaire}
            onChange={e => setCommentaire(e.target.value)}
            disabled={isSaved}
          />
        </Flex>
        <Flex alignItems="center" mt={2}>
          <Button onClick={saveCRA}>
            {isSaved ? "Modifier" : "Sauvegarder"}
          </Button>
          {isLoading && isSaved && <Text ml={3}>...Loading</Text>}
          {!isLoading && isSaved && (
            <Text ml={3}>Votre CRA a été sauvegardé</Text>
          )}
        </Flex>
      </Flex>
    </Card>
  );
}
