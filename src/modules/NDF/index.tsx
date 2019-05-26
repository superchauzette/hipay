import React from "react";
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
import { storageRef, ndfCol } from "../FirebaseHelper";
import { CircularProgress } from "@material-ui/core";
import { BtnAdd } from "../CommonUi/BtnAdd";
import { useCRUD, useTotal } from "../hooks";
import { FileType } from "./types";

type NoteType = {
  id?: string;
  dateAchat?: string;
  type?: string;
  description?: string;
  montant?: number;
  tva?: number;
  file?: FileType;
};

export function NoteDeFrais() {
  const user = useUserContext();
  const { month, year, handleChangeMonth } = useDateChange();
  const deps = { collection: ndfCol, storageRefPath: storageRef().charges };
  const {
    data: notes,
    isLoading,
    addData: addNote,
    removeData: deleteNote,
    handleChange,
    updateFile
  } = useCRUD<NoteType>({ user, month, year }, deps);
  const total = useTotal(notes, note => note.montant || 0);

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
            <div key={note.id}>
              <ListItem>
                <FormNDF
                  note={note}
                  onChange={n => handleChange(note.id, n)}
                  onDelete={deleteNote}
                  onUpdateFile={updateFile}
                />
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
      </Card>
      <BtnAdd onClick={addNote} />
    </PageWrapper>
  );
}
