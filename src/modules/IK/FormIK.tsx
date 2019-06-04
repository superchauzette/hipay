import React from "react";
import { TextField, BtnDelete } from "../CommonUi";
import { ikType } from "./types";

type FormIkProps = {
  ik: ikType;
  disabled?: boolean;
  onChange: (ik: ikType) => void;
  onDelete: (id: string | undefined) => void;
};

export function FormIK({ ik, disabled, onChange, onDelete }: FormIkProps) {
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
        id="Objectdudéplacement"
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
        label="Montant HT"
        type="number"
        disabled={disabled}
        value={ik.montant}
        onChange={e => onChange({ montant: Number(e.target.value) })}
      />

      <BtnDelete onClick={() => onDelete(ik.id)} disabled={disabled} />
    </form>
  );
}
