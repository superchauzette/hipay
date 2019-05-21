import React, { useState, useEffect } from "react";
import { Flex, Text } from "rebass";
import { MonthSelector, useDateChange } from "../CommonUi/MonthSelector";
import {
  List,
  ListItem,
  Button,
  Divider,
  CircularProgress
} from "@material-ui/core";
import { Card, Header, BtnAdd, PageWrapper } from "../CommonUi";
import { useUserContext } from "../UserHelper";
import { FormCharge } from "./FormCharge";
import { appDoc, storageRef } from "../FirebaseHelper";
import { ChargeType, FileType } from "./types";

function chargesDoc({ user, year, month }) {
  return appDoc().charges({ user, year, month });
}

function chargesCol({ user, year, month }) {
  return chargesDoc({ user, year, month }).collection("charges");
}

function getCharges(query) {
  const data = [] as any[];
  query.forEach(docData => {
    data.push({ ...docData.data(), id: docData.id });
  });
  return data;
}

export function Charges() {
  const user = useUserContext();
  const { month, year, handleChangeMonth } = useDateChange();
  const [charges, setCharges] = useState([] as ChargeType[]);
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    (async function init() {
      if (user) {
        setLoading(true);
        chargesCol({ user, year, month })
          .get()
          .then(getCharges)
          .then(setCharges);
        const doc = await chargesDoc({ user, year, month }).get();
        const isValidData = (doc.data() || {}).isValid;
        setIsValid(isValidData);
        setLoading(false);
      }
    })();
  }, [user, month, year]);

  async function addNote() {
    const { id } = await chargesCol({ user, year, month }).add({});
    setCharges(n => [...n, { id }]);
  }

  function validNotes() {
    chargesDoc({ user, year, month }).set(
      { isValid: !isValid },
      { merge: true }
    );
    setIsValid(v => !v);
  }

  function deleteNote(id: string | undefined) {
    chargesCol({ user, year, month })
      .doc(id)
      .delete();
    setCharges(n => n.filter(v => v.id !== id));
  }

  function handleChange(id: string | undefined, charge: ChargeType) {
    setCharges(piks => piks.map(n => (n.id === id ? { ...n, ...charge } : n)));
    chargesCol({ user, year, month })
      .doc(id)
      .update(charge);
  }

  function updateFile(file: FileType) {
    storageRef()
      .ik({ user, year, month })(file.name)
      .put(file);
  }

  return (
    <PageWrapper>
      <Header title="Charges" />
      <MonthSelector onChange={handleChangeMonth} />

      <Card width={1}>
        <List>
          {isLoading && (
            <Flex width={1} justifyContent="center">
              <CircularProgress />
            </Flex>
          )}
          {!charges.length && !isLoading && (
            <Text textAlign="center">Ajouter vos charges</Text>
          )}
          {charges.map(charge => (
            <>
              <ListItem key={charge.id}>
                <FormCharge
                  charge={charge}
                  disabled={isValid}
                  onChange={n => handleChange(charge.id, n)}
                  onDelete={deleteNote}
                  onUpdateFile={updateFile}
                />
              </ListItem>
              <Divider />
            </>
          ))}
        </List>
      </Card>
      <Flex width={1} mt={3}>
        <Button variant="contained" color="primary" onClick={validNotes}>
          {isValid ? "Modifier" : "Valider"}
        </Button>
      </Flex>
      <BtnAdd onClick={addNote} disabled={isValid} />
    </PageWrapper>
  );
}
