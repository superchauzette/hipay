import React, { useState, useEffect } from "react";
import { Flex, Text } from "rebass";
import { MonthSelector, useDateChange } from "../CommonUi/MonthSelector";
import { Header } from "../CommonUi/Header";
import { PageWrapper } from "../CommonUi/PageWrapper";
import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Divider from "@material-ui/core/Divider";
import { Card } from "../CommonUi/Card";
import IconButton from "@material-ui/core/IconButton";
import { Delete as DeleteIcon } from "@material-ui/icons";
import { useUserContext } from "../UserHelper";
import { db, storage } from "../App/fire";

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

type FormNDFProps = {
  note: NoteType;
  disabled: boolean;
  onChange: (note: NoteType) => void;
  onDelete: (id: string | undefined) => void;
  onUpdateFile: (file: FileType) => void;
};

function FormNDF({
  note,
  disabled,
  onChange,
  onDelete,
  onUpdateFile
}: FormNDFProps) {
  const [file, setFile] = useState(note.file);

  function handleFile(files) {
    const file: FileType = files[0];
    setFile(file);
    onChange({ file: { name: file.name, size: file.size, type: file.type } });
    onUpdateFile(file);
  }

  return (
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
        style={{ marginRight: "10px", marginBottom: "10px", width: "150px" }}
        InputLabelProps={{
          shrink: true
        }}
        disabled={disabled}
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
        disabled={disabled}
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
        disabled={disabled}
        value={note.description}
        onChange={e => onChange({ description: e.target.value })}
      />
      <TextField
        id="description"
        label="montant"
        type="number"
        style={{ marginRight: "10px", marginBottom: "10px" }}
        disabled={disabled}
        InputLabelProps={{
          shrink: true
        }}
        value={note.montant}
        onChange={e => onChange({ montant: Number(e.target.value) })}
      />
      <TextField
        id="description"
        label="TVA"
        type="number"
        style={{ marginRight: "10px", marginBottom: "10px" }}
        InputLabelProps={{
          shrink: true
        }}
        disabled={disabled}
        value={note.tva}
        onChange={e => onChange({ tva: Number(e.target.value) })}
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
          <Button variant="contained" component="span" disabled={disabled}>
            Upload
            <CloudUploadIcon style={{ marginLeft: "8px" }} />
          </Button>
        </label>
        <Text mt={2}>{file && file.name}</Text>
      </Flex>

      <IconButton
        aria-label="Delete"
        onClick={() => onDelete(note.id)}
        disabled={disabled}
      >
        <DeleteIcon />
      </IconButton>
    </form>
  );
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

function ndfDoc({ user, year, month }) {
  return db()
    .collection("users")
    .doc(user.uid)
    .collection("years")
    .doc(String(year))
    .collection("month")
    .doc(String(month))
    .collection("appData")
    .doc("ndf");
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
        // const doc = await ndfDoc({ user, year, month }).get();
        const query = await ndfDoc({ user, year, month })
          .collection("notes")
          .get();
        const notesData = [] as any[];
        query.forEach(docData => {
          notesData.push({ ...docData.data(), id: docData.id });
        });
        setNotes(notesData);
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
    ndfDoc({ user, year, month }).update({ isValid: !isValid });
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
    ndfDoc({ user, year, month }).update({ total });
  }

  function updateFile(file: FileType) {
    storage()
      .ref(`users/${user.uid}/years/${year}/month/${month}/ndk/${file.name}`)
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
