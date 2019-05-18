import React, { useState, useEffect } from "react";
import { Box, Button } from "rebass";
import { addNewCalendarFirebase, getCraIdsFirebase } from "./service";
import { MonthSelector, useDateChange } from "../CommonUi/MonthSelector";
import { useUserContext } from "../UserHelper";
import { CRA } from "./CRA";
import { Header } from "../CommonUi/Header";
import { PageWrapper } from "../CommonUi/PageWrapper";

export function CRAS() {
  const user = useUserContext();
  const { month, year, date, handleChangeMonth } = useDateChange();
  const [idsCRA, setIdsCRA] = useState(["1"] as string[]);

  useEffect(() => {
    if (user) getCraIdsFirebase({ user, year, month }).then(setIdsCRA);
  }, [user, year, month]);

  async function addNewCRA() {
    const id = await addNewCalendarFirebase({ date, user, month, year });
    setIdsCRA(ids => [...ids, id]);
  }

  return (
    <PageWrapper>
      <Header
        title="Compte rendu d'Activité"
        prevLink={{ to: "/", label: "dash" }}
        nextLink={{ to: "/ndf", label: "ndf" }}
      />
      <MonthSelector onChange={handleChangeMonth} />

      {idsCRA.map((idCRA, index) => (
        <CRA
          key={idCRA}
          showTrash={index !== 0}
          id={idCRA}
          user={user}
          date={date}
          month={month}
          year={year}
          onDelete={id => setIdsCRA(ids => ids.filter(i => i !== id))}
        />
      ))}

      <Box mt={4}>
        <Button onClick={addNewCRA}>+</Button>
      </Box>
    </PageWrapper>
  );
}
