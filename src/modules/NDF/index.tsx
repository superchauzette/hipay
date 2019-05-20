import React, { useState, useEffect } from "react";
import { Flex, Text, Button } from "rebass";
import { MonthSelector, useDateChange } from "../CommonUi/MonthSelector";
import { Header } from "../CommonUi/Header";
import { PageWrapper } from "../CommonUi/PageWrapper";
import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ButtonMd from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Divider from "@material-ui/core/Divider";
import { Card } from "../CommonUi/Card";
import IconButton from "@material-ui/core/IconButton";
import { Delete as DeleteIcon } from "@material-ui/icons";
import { useUserContext } from "../UserHelper";
import { db } from "../App/fire";

type NoteType = {
  id: number;
  dateaAchat?: Date;
  type?: string;
  description?: string;
  montant?: number;
  tva?: number;
  file?: any;
};

function MyListItem({ note, onChange, onDelete }) {
  const [file, setFile] = useState();

  function handleFile(files) {
    const file = files[0];
    setFile(file);
    onChange({ file });
  }

  return (
    <ListItem key={note.id}>
      <form
        noValidate
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          padding: "0 10px",
          marginTop: "10px"
        }}
      >
        <TextField
          id="date"
          label="Date d'achat"
          type="date"
          style={{ marginRight: "10px", marginBottom: "10px" }}
          InputLabelProps={{
            shrink: true
          }}
          value={note.dateAchat}
          onChange={e => onChange({ dateAchat: e.target.value })}
        />
        <TextField
          id="Type"
          label="Type"
          type="text"
          style={{ marginRight: "10px", marginBottom: "10px" }}
          InputLabelProps={{
            shrink: true
          }}
          value={note.type}
          onChange={e => onChange({ type: e.target.value })}
        />
        <TextField
          id="description"
          label="description"
          type="text"
          style={{ marginRight: "10px", marginBottom: "10px" }}
          InputLabelProps={{
            shrink: true
          }}
          value={note.description}
          onChange={e => onChange({ description: e.target.value })}
        />
        <TextField
          id="description"
          label="montant"
          type="number"
          style={{ marginRight: "10px", marginBottom: "10px" }}
          InputLabelProps={{
            shrink: true
          }}
          value={note.montant}
          onChange={e => onChange({ montant: e.target.value })}
        />
        <TextField
          id="description"
          label="TVA"
          type="number"
          style={{ marginRight: "10px", marginBottom: "10px" }}
          InputLabelProps={{
            shrink: true
          }}
          value={note.tva}
          onChange={e => onChange({ tva: e.target.value })}
        />
        <Flex flexDirection="column" alignItems="center">
          <input
            accept="image/*"
            id="contained-button-file"
            // multiple
            type="file"
            style={{ display: "none" }}
            onChange={e => handleFile(e.target.files)}
          />
          <label htmlFor="contained-button-file">
            <ButtonMd variant="contained" component="span">
              Upload
              <CloudUploadIcon style={{ marginLeft: "8px" }} />
            </ButtonMd>
          </label>
          <Text mt={2}>{file && file.name}</Text>
        </Flex>

        <IconButton aria-label="Delete" onClick={() => onDelete(note.id)}>
          <DeleteIcon />
        </IconButton>
      </form>
    </ListItem>
  );
}

export function NoteDeFrais() {
  const user = useUserContext();
  const { month, year, handleChangeMonth } = useDateChange();
  const [notes, setNotes] = useState([] as NoteType[]);

  const pathNDF =
    user && year ? `users/${user.uid}/years/${year}/month/${month}/ndf` : "";

  useEffect(() => {
    setNotes([]);
  }, [month, year]);

  function addNote() {
    setNotes(n => {
      const id = n.length ? n[n.length - 1].id + 1 : 0;
      return [...n, { id }];
    });
  }

  async function saveNotes() {
    if (pathNDF) {
      await db()
        .collection(pathNDF)
        .add(notes);
    }
  }

  function deleteNote(id: number) {}

  function handleChange(id: number, obj: NoteType) {
    setNotes(pnotes => pnotes.map(n => (n.id === id ? { ...n, ...obj } : n)));
  }

  return (
    <PageWrapper>
      <Header
        title="Note de Frais"
        prevLink={{ to: "/cra", label: "cra" }}
        nextLink={{ to: "/ik", label: "ik" }}
      />
      <MonthSelector onChange={handleChangeMonth} />

      <Flex width={1} mb={3} justifyContent="space-between">
        <Button onClick={addNote}>Add</Button>
        <Text>Total: 236€</Text>
      </Flex>
      <Card width={1}>
        <List>
          {!notes.length && (
            <Text textAlign="center">Ajouter vos notes de frais</Text>
          )}
          {notes.map((note, index) => (
            <>
              <MyListItem
                note={note}
                onChange={n => handleChange(index, n)}
                onDelete={deleteNote}
              />
              <Divider />
            </>
          ))}
        </List>
      </Card>
      <Flex justifyContent="flex-end" width={1} mt={3}>
        <Button onClick={saveNotes}>Sauvegarder</Button>
      </Flex>
    </PageWrapper>
  );
}
