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
import { FormNDF } from "./FormNDF";
import { appDoc, storageRef } from "../FirebaseHelper";
import { CircularProgress } from "@material-ui/core";
import { BtnAdd } from "../CommonUi/BtnAdd";

type NoteType = {
  id?: string;
  dateAchat?: string;
  type?: string;
  description?: string;
  montant?: number;
  tva?: number;
  file?: any;
};

type FileType = {
  name: string;
  type: string;
  size: number;
};

function getTotal(notes: NoteType[]) {
  if (!notes) return 0;

  return Number(
    notes
      .map(note => note.montant)
      .filter(montant => montant !== undefined)
      .reduce((a, b) => (a || 0) + (b || 0), 0)
  );
}

function ndfDoc({ user, year, month }) {
  return appDoc().ndf({ user, year, month });
}

function notesCol({ user, year, month }) {
  return appDoc()
    .ndf({ user, year, month })
    .collection("notes");
}

function getNotes(query): NoteType[] {
  const notesData = [] as any[];
  query.forEach(docData => {
    notesData.push({ ...docData.data(), id: docData.id });
  });
  return notesData;
}

export function NoteDeFrais() {
  const user = useUserContext();
  const { month, year, handleChangeMonth } = useDateChange();
  const [isLoading, setLoading] = useState(false);
  const [notes, setNotes] = useState([] as NoteType[]);
  const [isValid, setIsValid] = useState(false);
  const total = getTotal(notes);

  useEffect(() => {
    (async function init() {
      if (user) {
        setLoading(true);
        notesCol({ user, year, month })
          .get()
          .then(getNotes)
          .then(setNotes);
        const doc = await ndfDoc({ user, year, month }).get();
        const isValidData = (doc.data() || {}).isValid;
        setIsValid(isValidData);
        setLoading(false);
      }
    })();
  }, [user, month, year]);

  async function addNote() {
    const { id } = await notesCol({ user, year, month }).add({});
    setNotes(n => [...n, { id }]);
  }

  function validNotes() {
    ndfDoc({ user, year, month }).set({ isValid: !isValid }, { merge: true });
    setIsValid(v => !v);
  }

  function deleteNote(id: string | undefined) {
    notesCol({ user, year, month })
      .doc(id)
      .delete();
    setNotes(n => n.filter(v => v.id !== id));
  }

  function handleChange(id: string | undefined, note: NoteType) {
    setNotes(pnotes => pnotes.map(n => (n.id === id ? { ...n, ...note } : n)));
    notesCol({ user, year, month })
      .doc(id)
      .update(note);
    ndfDoc({ user, year, month }).set({ total }, { merge: true });
  }

  function updateFile(file: FileType) {
    storageRef()
      .ndf({ user, year, month })(file.name)
      .put(file);
  }

  return (
    <PageWrapper>
      <Header title="Note de Frais" />
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
          {!notes.length && !isLoading && (
            <Text textAlign="center">Ajouter vos notes de frais</Text>
          )}
          {notes.map(note => (
            <>
              <ListItem key={note.id}>
                <FormNDF
                  disabled={isValid}
                  note={note}
                  onChange={n => handleChange(note.id, n)}
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
