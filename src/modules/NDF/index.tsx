import React, { useState, useEffect } from "react";
import { Flex, Text } from "rebass";
import { MonthSelector, useDateChange } from "../CommonUi/MonthSelector";
import { Header } from "../CommonUi/Header";
import { PageWrapper } from "../CommonUi/PageWrapper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import { Card } from "../CommonUi/Card";
import { useUserContext } from "../UserHelper";
import { FormNDF } from "./FormNDF";
import { storageRef, ndfCol, extractQueries, userCol } from "../FirebaseHelper";
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

function getMyNotes({ user, month, year }) {
  return ndfCol()
    .where("userid", "==", user.uid)
    .where("month", "==", month)
    .where("year", "==", year)
    .get()
    .then(extractQueries);
}

function getTotal(notes: NoteType[]) {
  if (!notes) return 0;

  return Number(
    notes
      .map(note => note.montant)
      .filter(montant => montant !== undefined)
      .reduce((a, b) => (a || 0) + (b || 0), 0)
  );
}

export function NoteDeFrais() {
  const user = useUserContext();
  const { month, year, handleChangeMonth } = useDateChange();
  const [isLoading, setLoading] = useState(false);
  const [notes, setNotes] = useState([] as NoteType[]);
  const total = getTotal(notes);

  useEffect(() => {
    (async function init() {
      if (user) {
        setLoading(true);
        const notesDeFrais = await getMyNotes({ user, month, year });
        console.log(notesDeFrais);
        if (notesDeFrais.length) setNotes(notesDeFrais);
        else setNotes([{ id: "new" }]);
        setLoading(false);
      }
    })();
  }, [user, month, year]);

  async function addNote() {
    const { id } = await ndfCol().add({
      userid: user.uid,
      month,
      year,
      user: userCol().doc(user.uid)
    });
    setNotes(n => [...n, { id }]);
  }

  function deleteNote(id: string | undefined) {
    ndfCol()
      .doc(id)
      .delete();
    setNotes(n => n.filter(v => v.id !== id));
  }

  async function handleChange(id: string | undefined, note: NoteType) {
    if (id === "new") {
      const noteCreated = await ndfCol().add({
        note,
        userid: user.uid,
        month,
        year,
        user: userCol().doc(user.uid)
      });
      note.id = noteCreated.id;
    } else {
      ndfCol()
        .doc(id)
        .update(note);
    }
    setNotes(pnotes => pnotes.map(n => (n.id === id ? { ...n, ...note } : n)));
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
          {notes.map(note => (
            <>
              <ListItem key={note.id}>
                <FormNDF
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

      <BtnAdd onClick={addNote} />
    </PageWrapper>
  );
}
