import React, { useState } from "react";
import { db } from "../FirebaseHelper";
import {
  TextField,
  CardHeader,
  CardContent,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Button,
  CardActions,
  Switch
} from "@material-ui/core";
import { Card } from "../CommonUi";
import { get } from "lodash";
import { CheckCircle } from "@material-ui/icons";
import { MiniLoader } from "../CommonUi/MiniLoader";

type fiscTypes = "fisc.urssaf" | "fisc.cipav" | "fisc.tva";
type SaveState = {
  saved: boolean;
  loading: boolean;
  error: boolean;
};
export type FiscValue = {
  type: "MENSUEL" | "AFFILIATION" | "AMOUNT";
  amount?: number;
  date?: string;
  disable: boolean;
};

type FiscValueType = keyof FiscValue;

type FiscFieldProps = {
  label: string;
  save: (value: FiscValue) => void;
  selectedValue: FiscValue;
  saveState: SaveState;
};

const FiscField = ({
  label,
  selectedValue = { type: "AMOUNT", disable: false },
  save,
  saveState
}: FiscFieldProps) => {
  const [fiscValue, setFiscValue] = useState<FiscValue>(selectedValue);
  const update = (field: FiscValueType) => (value: any) =>
    setFiscValue({ ...fiscValue, [field]: value });
  const updateInput = (field: FiscValueType) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    update(field)(e.target.value);
  };
  return (
    <Card>
      <CardHeader
        title={
          <div>
            {label}
            <div style={{ float: "right" }}>
              {saveState.saved && <CheckCircle color="secondary" />}
              {saveState.loading && <MiniLoader />}
            </div>
          </div>
        }
      />
      <CardContent>
        <FormControl fullWidth component="code">
          <FormLabel>Activer</FormLabel>
          <Switch
            checked={!fiscValue.disable}
            onClick={() => update("disable")(!fiscValue.disable)}
          />
        </FormControl>
        <FormControl component="fieldset">
          <RadioGroup
            defaultValue="AMOUNT"
            aria-label="gender"
            name="customized-radios"
          >
            <FormControlLabel
              label="Montant"
              control={
                <Radio
                  checked={fiscValue.type === "AMOUNT"}
                  onChange={updateInput("type")}
                  value="AMOUNT"
                  name="radio-amount"
                  inputProps={{ "aria-label": "A" }}
                />
              }
            />
            <FormControlLabel
              label="Affiliation"
              control={
                <Radio
                  checked={fiscValue.type === "AFFILIATION"}
                  onChange={updateInput("type")}
                  value="AFFILIATION"
                  name="radio-affiliation"
                  inputProps={{ "aria-label": "B" }}
                />
              }
            />
            <FormControlLabel
              label="Mensuel"
              control={
                <Radio
                  checked={fiscValue.type === "MENSUEL"}
                  onChange={updateInput("type")}
                  value="MENSUEL"
                  name="radio-mensuel"
                  inputProps={{ "aria-label": "B" }}
                />
              }
            />
          </RadioGroup>
        </FormControl>
        {fiscValue.type === "AMOUNT" && (
          <div>
            <TextField
              onChange={updateInput("amount")}
              value={fiscValue.amount}
              type="number"
              label="montant"
            />
            <TextField
              onChange={updateInput("date")}
              value={fiscValue.date}
              type="date"
              InputLabelProps={{
                shrink: true
              }}
              label="échéance"
            />
          </div>
        )}
      </CardContent>
      <CardActions>
        <Button onClick={() => save(fiscValue)} color="secondary">
          Save
        </Button>
      </CardActions>
    </Card>
  );
};

export const FiscAdmin = ({ user }) => {
  const [saveState, setSaveState] = useState({
    "fisc.urssaf": {
      saved: get(user, "fisc.urssaf"),
      loading: false,
      error: false
    },
    "fisc.cipav": {
      saved: get(user, "fisc.cipav"),
      loading: false,
      error: false
    },
    "fisc.tva": {
      saved: get(user, "fisc.tva"),
      loading: false,
      error: false
    }
  });
  const save = (field: fiscTypes) => (value: FiscValue) => {
    setSaveState({
      ...saveState,
      [field]: {
        saved: false,
        loading: true,
        error: false
      }
    });
    db()
      .collection("users")
      .doc(user.id)
      .update({ [`${field}`]: value })
      .then(() =>
        setSaveState({
          ...saveState,
          [field]: {
            saved: true,
            loading: false,
            error: false
          }
        })
      )
      .catch(e => {
        setSaveState({
          ...saveState,
          [field]: {
            saved: false,
            loading: false,
            error: true
          }
        });
      });
  };
  return (
    <>
      <FiscField
        save={save("fisc.urssaf")}
        selectedValue={get(user, "fisc.urssaf")}
        saveState={saveState["fisc.urssaf"]}
        label="URSSAF"
      />
      <FiscField
        save={save("fisc.cipav")}
        selectedValue={get(user, "fisc.cipav")}
        saveState={saveState["fisc.cipav"]}
        label="CIPAV"
      />
      <FiscField
        save={save("fisc.tva")}
        selectedValue={get(user, "fisc.tva")}
        saveState={saveState["fisc.tva"]}
        label="TVA"
      />
    </>
  );
};
