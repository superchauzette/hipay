import React, { useState, useEffect } from "react";
import { useUserContext } from "../UserHelper";
import { CRA } from "./CRA";
import {
  Header,
  PageWrapper,
  BtnAdd,
  MonthSelector,
  useDateChange
} from "../CommonUi";
import { getMyCras } from "./service";

export function CRAS() {
  const user = useUserContext();
  const { month, year, date, handleChangeMonth } = useDateChange();
  const [cras, setCras] = useState([{ id: 0 }] as any[]);

  useEffect(() => {
    if (user) {
      getMyCras({ user, month, year }).then(myCras => {
        if (myCras.length) setCras(myCras);
        else setCras([{}]);
      });
    }
  }, [user, year, month]);

  async function addNewCRA() {
    setCras(state => [...state, {}]);
  }

  return (
    <PageWrapper pb="75px">
      <Header title="Compte rendu d'Activité" />
      <MonthSelector onChange={handleChangeMonth} />

      {cras.map((cra, index) => (
        <CRA
          key={cra.id}
          cra={cra}
          showTrash={index !== 0}
          user={user}
          date={date}
          month={month}
          year={year}
        />
      ))}

      <BtnAdd onClick={addNewCRA} />
    </PageWrapper>
  );
}
