import React, { useState } from "react";
import { Flex, Heading, Text, Button } from "rebass";
import { MonthSelector, useDateChange } from "../CommonUi/MonthSelector";
import { Header } from "../CommonUi/Header";
import { PageWrapper } from "../CommonUi/PageWrapper";
import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ButtonMd from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Divider from "@material-ui/core/Divider";
import { Card } from "../CommonUi/Card";
import IconButton from "@material-ui/core/IconButton";
import { Delete as DeleteIcon } from "@material-ui/icons";
import { useUserContext } from "../UserHelper";

function MyListItem() {
  const [file, setFile] = useState();
  function handleFile(files) {
    console.log(files);
    setFile(files[0]);
  }

  return (
    <ListItem>
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
        />
        <TextField
          id="Type"
          label="Type"
          type="text"
          style={{ marginRight: "10px", marginBottom: "10px" }}
          InputLabelProps={{
            shrink: true
          }}
        />
        <TextField
          id="description"
          label="description"
          type="text"
          style={{ marginRight: "10px", marginBottom: "10px" }}
          InputLabelProps={{
            shrink: true
          }}
        />
        <TextField
          id="description"
          label="motant"
          type="number"
          style={{ marginRight: "10px", marginBottom: "10px" }}
          InputLabelProps={{
            shrink: true
          }}
        />
        <TextField
          id="description"
          label="TVA"
          type="number"
          style={{ marginRight: "10px", marginBottom: "10px" }}
          InputLabelProps={{
            shrink: true
          }}
        />
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
        <Text>{file && file.name}</Text>

        <IconButton aria-label="Delete">
          <DeleteIcon />
        </IconButton>
      </form>
    </ListItem>
  );
}

export function NoteDeFrais() {
  const user = useUserContext();
  const { handleChangeMonth } = useDateChange();
  const [notes, setNotes] = useState([] as number[]);

  // const pathCra = user
  //   ? `users/${user.uid}/years/${year}/month/${month}/cra`
  //   : "";

  function addNote() {
    setNotes(n => [...n, 1]);
  }

  function saveNotes() {}

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
          {notes.map(n => (
            <>
              <MyListItem />
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
