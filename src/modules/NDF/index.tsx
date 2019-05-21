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
  const [notes, setNotes] = useState([] as NoteType[]);
  const [isValid, setIsValid] = useState(false);
  const total = getTotal(notes);

  useEffect(() => {
    (async function init() {
      if (user) {
        ndfDoc({ user, year, month })
          .collection("notes")
          .get()
          .then(getNotes)
          .then(setNotes);
        const doc = await ndfDoc({ user, year, month }).get();
        console.log(doc.data());
        const isValidData = (doc.data() || {}).isValid;
        setIsValid(isValidData);
      }
    })();
  }, [user, month, year]);

  async function addNote() {
    const { id } = await ndfDoc({ user, year, month })
      .collection("notes")
      .add({});
    setNotes(n => [...n, { id }]);
  }

  function validNotes() {
    ndfDoc({ user, year, month }).set({ isValid: !isValid }, { merge: true });
    setIsValid(v => !v);
  }

  function deleteNote(id: string | undefined) {
    ndfDoc({ user, year, month })
      .collection("notes")
      .doc(id)
      .delete();
    setNotes(n => n.filter(v => v.id !== id));
  }

  function handleChange(id: string | undefined, note: NoteType) {
    setNotes(pnotes => pnotes.map(n => (n.id === id ? { ...n, ...note } : n)));
    ndfDoc({ user, year, month })
      .collection("notes")
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

      <Flex width={1} mb={3} justifyContent="space-between">
        <Button
          variant="raised"
          color="primary"
          onClick={addNote}
          disabled={isValid}
        >
          Add
        </Button>
        <Text>Total: {total}€</Text>
      </Flex>
      <Card width={1}>
        <List>
          {!notes.length && (
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
      <Flex justifyContent="flex-end" width={1} mt={3}>
        <Button variant="raised" color="primary" onClick={validNotes}>
          {isValid ? "Modifier" : "Valider"}
        </Button>
      </Flex>
    </PageWrapper>
  );
}
