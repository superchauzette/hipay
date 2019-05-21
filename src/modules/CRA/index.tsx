import React, { useState, useEffect } from "react";
import { addNewCalendarFirebase, getCraIdsFirebase } from "./service";
import { useUserContext } from "../UserHelper";
import { CRA } from "./CRA";
import {
  Header,
  PageWrapper,
  BtnAdd,
  MonthSelector,
  useDateChange
} from "../CommonUi";

export function CRAS() {
  const user = useUserContext();
  const { month, year, date, handleChangeMonth } = useDateChange();
  const [idsCRA, setIdsCRA] = useState([] as string[]);

  useEffect(() => {
    if (user) getCraIdsFirebase({ user, year, month }).then(setIdsCRA);
  }, [user, year, month]);

  async function addNewCRA() {
    const id = await addNewCalendarFirebase({ date, user, month, year });
    setIdsCRA(ids => [...ids, id]);
  }

  return (
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
      <BtnAdd onClick={addNewCRA} />
    </PageWrapper>
  );
}
