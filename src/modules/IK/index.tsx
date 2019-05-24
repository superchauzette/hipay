import React, { useState, useEffect } from "react";
import { Flex, Text } from "rebass";
import { MonthSelector, useDateChange } from "../CommonUi/MonthSelector";
import { Card, Header, PageWrapper } from "../CommonUi";
import { useUserContext } from "../UserHelper";
import { FormIK } from "./FormIK";
import { storageRef, ikCol, extractQueries, userCol } from "../FirebaseHelper";
import { ikType, FileType } from "./types";
import { BtnAdd } from "../CommonUi/BtnAdd";
import { Divider, CircularProgress, List, ListItem } from "@material-ui/core";

function getTotal(iks: ikType[]) {
  if (!iks) return 0;

  return Number(
    iks
      .map(ik => ik.montant)
      .filter(montant => montant !== undefined)
      .reduce((a, b) => (a || 0) + (b || 0), 0)
  );
}

function getMyIks({ user, month, year }): Promise<ikType[]> {
  return ikCol()
    .where("userid", "==", user.uid)
    .where("month", "==", month)
    .where("year", "==", year)
    .get()
    .then(extractQueries);
}

export function IK() {
  const user = useUserContext();
  const { month, year, handleChangeMonth } = useDateChange();
  const [iks, setIks] = useState([] as ikType[]);
  const [isLoading, setLoading] = useState(false);
  const total = getTotal(iks);

  useEffect(() => {
    (async function init() {
      if (user) {
        setLoading(true);
        const myiks = await getMyIks({ user, month, year });
        if (myiks.length) setIks(myiks);
        else setIks([{ id: "new" }]);
        setLoading(false);
      }
    })();
  }, [user, month, year]);

  async function addNote() {
    const { id } = await ikCol().add({
      userid: user.uid,
      month,
      year,
      user: userCol().doc(user.uid)
    });
    setIks(n => [...n, { id }]);
  }

  function deleteNote(id: string | undefined) {
    ikCol()
      .doc(id)
      .delete();
    setIks(n => n.filter(v => v.id !== id));
  }

  async function handleChange(id: string | undefined, ik: ikType) {
    if (id === "new") {
      const noteCreated = await ikCol().add({
        ...ik,
        userid: user.uid,
        month,
        year,
        user: userCol().doc(user.uid)
      });
      ik.id = noteCreated.id;
    } else {
      ikCol()
        .doc(id)
        .update(ik);
    }
    setIks(state => state.map(n => (n.id === id ? { ...n, ...ik } : n)));
  }

  function updateFile(file: FileType) {
    storageRef()
      .ndf({ user, year, month })(file.name)
      .put(file);
  }

  return (
    <PageWrapper>
      <Header title="Indemnités Kilométriques" />
      <MonthSelector onChange={handleChangeMonth} />

      <Flex width={1} mb={3} justifyContent="flex-end">
        <Text>Total: {total}€</Text>
      </Flex>
      <Card width={1}>
        <List>
          {isLoading && (
            <Flex width={1} justifyContent="center">
              <CircularProgress />
            </Flex>
          )}
          {!iks.length && !isLoading && (
            <Text textAlign="center">Ajouter vos indemnités kilométriques</Text>
          )}
          {iks.map(ik => (
            <>
              <ListItem key={ik.id}>
                <FormIK
                  ik={ik}
                  onChange={n => handleChange(ik.id, n)}
                  onDelete={deleteNote}
                  onUpdateFile={updateFile}
                />
              </ListItem>
              <Divider />
            </>
          ))}
        </List>
      </Card>
      <Flex width={1} mt={3} />
      <BtnAdd onClick={addNote} />
    </PageWrapper>
  );
}
