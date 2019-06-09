import React from "react";
import { Flex, Text } from "rebass";
import {
  MonthSelector,
  useDateChange,
  PageWrapper,
  LinkPdf,
  Header
} from "../CommonUi";
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
import { DocumentNDF } from "./pdf";

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
  const deps = { collection: ndfCol, storageRefPath: storageRef().ndf };
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

      <Flex
        width={1}
        mb={3}
        px={2}
        justifyContent="space-between"
        alignItems="center"
      >
        {notes && notes.length > 0 && user && (
          <LinkPdf
            key="note-de-frais"
            fileName="note-de-frais.pdf"
            document={
              <DocumentNDF
                key="note-de-frais"
                notes={notes}
                total={total}
                user={user}
              />
            }
          />
        )}
        <Text fontWeight="bold" fontSize="18px">
          Total: {total}€
        </Text>
      </Flex>
      <Card width={1}>
        <List>
          {isLoading && (
            <Flex width={1} justifyContent="center">
              <CircularProgress />
            </Flex>
          )}
          {notes.map((note, index) => (
            <div key={note.id}>
              <ListItem>
                <FormNDF
                  note={note}
                  onChange={n => handleChange(note.id, n)}
                  onDelete={deleteNote}
                  onUpdateFile={updateFile}
                />
              </ListItem>
              {notes.length - 1 !== index && <Divider />}
            </div>
          ))}
        </List>
      </Card>
      <BtnAdd onClick={addNote} />
    </PageWrapper>
  );
}
