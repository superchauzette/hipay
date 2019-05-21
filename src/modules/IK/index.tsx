import React, { useState, useEffect } from "react";
import { Flex, Text } from "rebass";
import { MonthSelector, useDateChange } from "../CommonUi/MonthSelector";
import { Header } from "../CommonUi/Header";
import { PageWrapper } from "../CommonUi/PageWrapper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import { Card } from "../CommonUi/Card";
import { useUserContext } from "../UserHelper";
import { FormIK } from "./FormIK";
import { appDoc, storageRef } from "../FirebaseHelper";
import { ikType, FileType } from "./types";
import { BtnAdd } from "../CommonUi/BtnAdd";

function getTotal(iks: ikType[]) {
  if (!iks) return 0;

  return Number(
    iks
      .map(ik => ik.montant)
      .filter(montant => montant !== undefined)
      .reduce((a, b) => (a || 0) + (b || 0), 0)
  );
}

function ikDoc({ user, year, month }) {
  return appDoc().ik({ user, year, month });
}

function iksCol({ user, year, month }) {
  return ikDoc({ user, year, month }).collection("iks");
}

function getIks(query) {
  const notesData = [] as any[];
  query.forEach(docData => {
    notesData.push({ ...docData.data(), id: docData.id });
  });
  return notesData;
}

export function IK() {
  const user = useUserContext();
  const { month, year, handleChangeMonth } = useDateChange();
  const [iks, setIks] = useState([] as ikType[]);
  const [isValid, setIsValid] = useState(false);
  const total = getTotal(iks);

  useEffect(() => {
    (async function init() {
      if (user) {
        iksCol({ user, year, month })
          .get()
          .then(getIks)
          .then(setIks);
        const doc = await ikDoc({ user, year, month }).get();
        const isValidData = (doc.data() || {}).isValid;
        setIsValid(isValidData);
      }
    })();
  }, [user, month, year]);

  async function addNote() {
    const { id } = await iksCol({ user, year, month }).add({});
    setIks(n => [...n, { id }]);
  }

  function validNotes() {
    ikDoc({ user, year, month }).set({ isValid: !isValid }, { merge: true });
    setIsValid(v => !v);
  }

  function deleteNote(id: string | undefined) {
    iksCol({ user, year, month })
      .doc(id)
      .delete();
    setIks(n => n.filter(v => v.id !== id));
  }

  function handleChange(id: string | undefined, ik: ikType) {
    setIks(piks => piks.map(n => (n.id === id ? { ...n, ...ik } : n)));
    iksCol({ user, year, month })
      .doc(id)
      .update(ik);
    ikDoc({ user, year, month }).set({ total }, { merge: true });
  }

  function updateFile(file: FileType) {
    storageRef()
      .ik({ user, year, month })(file.name)
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
          {!iks.length && (
            <Text textAlign="center">Ajouter vos indemnités kilométriques</Text>
          )}
          {iks.map(ik => (
            <>
              <ListItem key={ik.id}>
                <FormIK
                  disabled={isValid}
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
      <Flex width={1} mt={3}>
        <Button variant="raised" color="primary" onClick={validNotes}>
          {isValid ? "Modifier" : "Valider"}
        </Button>
      </Flex>
      <BtnAdd onClick={addNote} disabled={isValid} />
    </PageWrapper>
  );
}
