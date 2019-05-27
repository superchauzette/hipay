import React, { useState } from "react";
import { Text, Flex } from "rebass";
import { TextField, BtnUpload, BtnDelete } from "../CommonUi";
import { ChargeType, FileType } from "./types";

type FormIkProps = {
  charge: ChargeType;
  disabled?: boolean;
  onChange: (charge: ChargeType) => void;
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
      <Flex>
        <BtnUpload
          id={`btn-ik-upload-${charge.id}`}
          disabled={disabled}
          onChange={e => handleFile(e.target.files)}
        />
        <Text mt={2} ml={3}>
          {file && file.name}
        </Text>
      </Flex>
      <BtnDelete onClick={() => onDelete(charge.id)} disabled={disabled} />
    </form>
  );
}
