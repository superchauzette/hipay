import React, { useState, useEffect } from "react";
import { useUserContext } from "../UserHelper";
import { FormCra } from "./FormCra";
import {
  Header,
  PageWrapper,
  BtnAdd,
  MonthSelector,
  useDateChange
} from "../CommonUi";
import { userCol } from "../FirebaseHelper";
import { getMyCras, getCalculatedCalendar } from "./service";
import { CircularProgress } from "@material-ui/core";
import { Flex } from "rebass";
import { uidv4 } from "../uid";

async function createNewCRA({ date, month, year, user }) {
  const calendar = await getCalculatedCalendar(date);
  const craData = {
    id: uidv4(),
    calendar,
    month,
    year,
    userid: user.uid,
    user: userCol().doc(user.uid)
  };
  return craData;
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
        console.log(myCras, user, month, year);
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

  async function addNewCRA(e) {
    try {
      e.preventDefault();
      e.stopPropagation();
      setLoadingAdd(true);
      const newCra = await createNewCRA({ date, month, year, user });
      setCras(state => [...state, newCra]);
    } catch (err) {
      console.error("add cra ", err);
    } finally {
      setLoadingAdd(false);
    }
  }

  console.log(cras);

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
          <FormCra
            key={cra.id}
            cra={cra}
            showTrash={index !== 0}
            user={user}
            month={month}
            year={year}
          />
        ))}

      <BtnAdd loading={isLoadingAdd} onClick={addNewCRA} />
    </PageWrapper>
  );
}
