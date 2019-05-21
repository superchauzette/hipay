import React, { useState } from "react";
import { Delete as DeleteIcon } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import { Text } from "rebass";
import { BtnUpload } from "../CommonUi/BtnUpload";
import { TextField } from "../CommonUi/TextField";
import { ChargeType, FileType } from "./types";

type FormIkProps = {
  charge: ChargeType;
  disabled: boolean;
  onChange: (ik: ChargeType) => void;
  onDelete: (id: string | undefined) => void;
  onUpdateFile: (file: FileType) => void;
};

export function FormCharge({
  charge,
  disabled,
  onChange,
  onDelete,
  onUpdateFile
}: FormIkProps) {
  const [file, setFile] = useState(charge.file);

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
        id="description"
        label="Description"
        disabled={disabled}
        value={charge.description}
        onChange={e => onChange({ description: e.target.value })}
      />
      <BtnUpload
        id={`btn-ik-upload-${charge.id}`}
        disabled={disabled}
        onChange={e => handleFile(e.target.files)}
      />
      <Text mt={2}>{file && file.name}</Text>
      <IconButton
        aria-label="Delete"
        onClick={() => onDelete(charge.id)}
        disabled={disabled}
      >
        <DeleteIcon />
      </IconButton>
    </form>
  );
}
