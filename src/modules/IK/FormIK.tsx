import React, { useState } from "react";
import { Delete as DeleteIcon } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import { Flex, Text } from "rebass";
import { BtnUpload } from "../CommonUi/BtnUpload";
import { TextField } from "../CommonUi/TextField";
import { ikType, FileType } from "./types";

type FormIkProps = {
  ik: ikType;
  disabled: boolean;
  onChange: (ik: ikType) => void;
  onDelete: (id: string | undefined) => void;
  onUpdateFile: (file: FileType) => void;
};

export function FormIK({
  ik,
  disabled,
  onChange,
  onDelete,
  onUpdateFile
}: FormIkProps) {
  const [file, setFile] = useState(ik.file);

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
        label="Date"
        type="date"
        disabled={disabled}
        value={ik.dateIk}
        onChange={e => onChange({ dateIk: e.target.value })}
      />
      <TextField
        id="Object du déplacement"
        label="Object du déplacement"
        disabled={disabled}
        value={ik.objectDeplacement}
        onChange={e => onChange({ objectDeplacement: e.target.value })}
      />
      <TextField
        id="lieuDepartArriveeRetour"
        label="Lieu de Départ/Arrivée/Retour"
        disabled={disabled}
        value={ik.lieuDepartArriveeRetour}
        onChange={e => onChange({ lieuDepartArriveeRetour: e.target.value })}
      />
      <TextField
        id="kmParcours"
        label="km Parcourus"
        type="number"
        disabled={disabled}
        value={ik.kmParcourus}
        onChange={e => onChange({ kmParcourus: Number(e.target.value) })}
      />
      <TextField
        id="puissanceFiscale"
        label="Puissance Fiscale"
        type="number"
        disabled={disabled}
        value={ik.puissanceFiscale}
        onChange={e => onChange({ puissanceFiscale: Number(e.target.value) })}
      />
      <TextField
        id="montant"
        label="Montant"
        type="number"
        disabled={disabled}
        value={ik.montant}
        onChange={e => onChange({ montant: Number(e.target.value) })}
      />
      <Flex flexDirection="column" alignItems="center">
        <BtnUpload
          id={`btn-ik-upload-${ik.id}`}
          disabled={disabled}
          onChange={e => handleFile(e.target.files)}
        />
        <Text mt={2}>{file && file.name}</Text>
      </Flex>

      <IconButton
        aria-label="Delete"
        onClick={() => onDelete(ik.id)}
        disabled={disabled}
      >
        <DeleteIcon />
      </IconButton>
    </form>
  );
}
