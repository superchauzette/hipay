import React, { useState, useEffect } from "react";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
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
    <>
      <PageWrapper pb="60px">
        <Header title="Compte rendu d'Activité" />
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
      </PageWrapper>

      <Fab
        aria-label="Add"
        onClick={addNewCRA}
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          backgroundColor: "#07c",
          color: "white"
        }}
      >
        <AddIcon />
      </Fab>
    </>
  );
}
