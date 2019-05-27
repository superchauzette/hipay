import React from "react";
import { Page, Text, View, Document } from "@react-pdf/renderer";

function Note({ note }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
      <Text style={{ width: "16%" }}>{note.dateAchat}</Text>
      <Text style={{ width: "16%" }}>{note.type}</Text>
      <Text style={{ width: "16%" }}>{note.description}</Text>
      <Text style={{ width: "16%" }}>{note.montant}</Text>
      <Text style={{ width: "16%" }}>{note.tva}</Text>
    </View>
  );
}

function formatMonthYear(data) {
  const monthText = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre"
  ];
  const firstData = data[0];
  const [month, year] = [firstData.month, firstData.year];
  return `${monthText[month - 1]} ${year}`;
}

export function DocumentNDF({ notes, total, user }) {
  const date = formatMonthYear(notes);

  return (
    <Document>
      <Page
        size="A4"
        orientation="landscape"
        style={{ flexDirection: "row", backgroundColor: "#E4E4E4" }}
      >
        <View style={{ margin: 10, padding: 10, width: "97%" }}>
          <Text style={{ textAlign: "center", marginBottom: "40px" }}>
            Note de Frais de {date}
          </Text>
          <Text>{user.displayName}</Text>
          <Text style={{ marginBottom: "30px" }}>Total : {total}€</Text>
          <Note
            note={{
              dateAchat: "Date d'Achat",
              type: "Type",
              description: "Description",
              montant: "Montant",
              tva: "TVA"
            }}
          />
          <View style={{ flexDirection: "column", width: "100%" }}>
            {notes.map(note => (
              <Note key={note.id} note={note} />
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
}
