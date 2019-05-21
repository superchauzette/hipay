import React, { useState } from "react";
import { Delete as DeleteIcon } from "@material-ui/icons";
import { TextField, IconButton } from "@material-ui/core";
import { Flex, Text } from "rebass";
import { BtnUpload } from "../CommonUi/BtnUpload";
import { NoteType, FileType } from "./types";

type FormNDFProps = {
  note: NoteType;
  disabled: boolean;
  onChange: (note: NoteType) => void;
  onDelete: (id: string | undefined) => void;
  onUpdateFile: (file: FileType) => void;
};

export function FormNDF({
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
        <BtnUpload
          id={`btn-ik-upload-${note.id}`}
          disabled={disabled}
          onChange={e => handleFile(e.target.files)}
        />
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
