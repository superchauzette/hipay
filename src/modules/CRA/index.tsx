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
import { craCol, userCol } from "../FirebaseHelper";
import { getMyCras, getCalculatedCalendar } from "./service";
import { CircularProgress } from "@material-ui/core";
import { Flex } from "rebass";

async function createNewCRA({ date, month, year, user }) {
  const calendar = await getCalculatedCalendar(date);
  const craData = {
    calendar,
    month,
    year,
    userid: user.uid,
    user: userCol().doc(user.uid)
  };
  const dataCreated = await craCol().add(craData);
  return { id: dataCreated.id, ...craData };
}

export function CRAS() {
  const user = useUserContext();
  const [isLoading, setLoading] = useState(false);
  const [isLoadingAdd, setLoadingAdd] = useState(false);
  const { month, year, date, handleChangeMonth } = useDateChange();
  const [cras, setCras] = useState([] as any[]);

  useEffect(() => {
    (async function init() {
      if (user && month && year) {
        setLoading(true);
        const myCras = await getMyCras({ user, month, year });
        if (myCras.length) {
          setCras(myCras);
        } else {
          const newCra = await createNewCRA({ date, month, year, user });
          setCras(state => [...state, newCra]);
        }
        setLoading(false);
      }
    })();
  }, [user, month, year, date]);

  async function addNewCRA() {
    try {
      setLoadingAdd(true);
      const newCra = await createNewCRA({ date, month, year, user });
      setCras(state => [...state, newCra]);
    } catch (err) {
      console.error("add cra ", err);
    } finally {
      setLoadingAdd(false);
    }
  }

  return (
    <PageWrapper>
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
            key={cra.id}
            cra={cra}
            showTrash={index !== 0}
            user={user}
            date={date}
            month={month}
            year={year}
            onDelete={() => {
              getMyCras({ user, month, year }).then(setCras);
            }}
          />
        ))}

      <BtnAdd loading={isLoadingAdd} onClick={addNewCRA} />
    </PageWrapper>
  );
}
