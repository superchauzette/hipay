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
import { getMyCras, getCalculatedCalendar } from "./service";
import { CircularProgress } from "@material-ui/core";
import { Flex } from "rebass";

export function CRAS() {
  const user = useUserContext();
  const [isLoading, setLoading] = useState(false);
  const { month, year, date, handleChangeMonth } = useDateChange();
  const [cras, setCras] = useState([] as any[]);

  useEffect(() => {
    (async function init() {
      if (user) {
        setLoading(true);
        const myCras = await getMyCras({ user, month, year });
        if (myCras.length) {
          setCras(myCras);
        } else {
          const calendar = await getCalculatedCalendar(date);
          setCras([{ id: "new", calendar }]);
        }
        setLoading(false);
      }
    })();
  }, [user, year, month, date]);

  async function addNewCRA() {
    setCras(state => [...state, {}]);
  }

  return (
    <PageWrapper pb="75px">
      <Header title="Compte rendu d'Activité" />
      <MonthSelector onChange={handleChangeMonth} />

      {isLoading && (
        <Flex>
          <CircularProgress />
        </Flex>
      )}

      {!isLoading &&
        cras.map((cra, index) => (
          <CRA
            key={cra.id || index}
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
