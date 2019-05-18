import {} from "./CRA";
import {} from "./CRA";
import React, { useState, useEffect } from "react";
import { Flex, Heading, Box, Button } from "rebass";
import { getCalculatedCalendar } from "./getCalendar";
import { MonthSelector } from "../CommonUi/MonthSelector";
import { useUserContext } from "../UserHelper";
import { db } from "../App/fire";
import { CRA } from "./CRA";
import { Link } from "react-router-dom";

export function CRAS() {
  const user = useUserContext();
  const [month, setMonth] = useState(0);
  const [year, setYear] = useState(0);
  const [date, setDate] = useState();
  const [nbCRA, setNbCRA] = useState(["1"] as string[]);

  useEffect(() => {
    if (user)
      db()
        .collection(`users/${user.uid}/years/${year}/month/${month}/cra`)
        .get()
        .then(query => {
          const ids = [] as any[];
          query.forEach(doc => {
            ids.push(doc.id);
          });
          setNbCRA(ids.length ? ids : ["1"]);
        });
  }, [user, month, year]);

  async function changeCRA({ month, year }, selectedDate) {
    setMonth(month);
    setYear(year);
    setDate(selectedDate);
  }

  async function addCRA() {
    const newCalendar = await getCalculatedCalendar(date);

    const { id } = await db()
      .collection(`users/${user.uid}/years/${year}/month/${month}/cra`)
      .add({ calendar: newCalendar });
    setNbCRA(ids => [...ids, id]);
  }

  return (
    <Flex p={[0, 3]} flexDirection="column" alignItems="center">
      <Flex alignItems="center">
        <Link to="/">{"<"}</Link>
        <Heading textAlign="center">Compte rendu d'Activité</Heading>
        <Link to="/ndf"> {">"} </Link>
      </Flex>
      <MonthSelector onChange={changeCRA} />

      {nbCRA.map((idCRA, index) => (
        <CRA
          key={idCRA}
          showTrash={index !== 0}
          id={idCRA}
          user={user}
          date={date}
          month={month}
          year={year}
          onDelete={id => setNbCRA(ids => ids.filter(i => i !== id))}
        />
      ))}

      <Box mt={4}>
        <Button onClick={addCRA}>+</Button>
      </Box>
    </Flex>
  );
}
