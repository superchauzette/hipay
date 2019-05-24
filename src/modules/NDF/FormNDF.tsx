import React, { useState } from "react";
import { Flex, Text } from "rebass";
import { BtnUpload, BtnDelete, TextField } from "../CommonUi";
import { NoteType, FileType } from "./types";

type FormNDFProps = {
  note: NoteType;
  disabled?: boolean;
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
    <form noValidate style={{ width: "100%" }}>
      <Flex
        flexDirection={["column", "row"]}
        justifyContent={["center", "space-between", "space-between"]}
        alignItems={["center"]}
        flexWrap="wrap"
        p="0 10px"
        mt="10px"
        width={1}
      >
        <TextField
          id="date"
          label="Date d'achat"
          type="date"
          disabled={disabled}
          value={note.dateAchat}
          onChange={e => onChange({ dateAchat: e.target.value })}
        />
        <TextField
          id="Type"
          label="Type"
          disabled={disabled}
          value={note.type}
          onChange={e => onChange({ type: e.target.value })}
        />
        <TextField
          id="description"
          label="description"
          disabled={disabled}
          value={note.description}
          onChange={e => onChange({ description: e.target.value })}
        />
        <TextField
          id="description"
          label="montant"
          type="number"
          value={note.montant}
          onChange={e => onChange({ montant: Number(e.target.value) })}
        />
        <TextField
          id="description"
          label="TVA"
          type="number"
          disabled={disabled}
          value={note.tva}
          onChange={e => onChange({ tva: Number(e.target.value) })}
        />
        <Flex flexDirection="column" alignItems={["center"]} mt={1}>
          <BtnUpload
            id={`btn-ik-upload-${note.id}`}
            disabled={disabled}
            onChange={e => handleFile(e.target.files)}
          />
          <Text mt={2}>{file && file.name}</Text>
        </Flex>

        <BtnDelete onClick={() => onDelete(note.id)} disabled={disabled} />
      </Flex>
    </form>
  );
}
