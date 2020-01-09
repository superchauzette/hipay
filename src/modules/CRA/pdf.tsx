import React from "react";
import { Page, Text, View, Document } from "@react-pdf/renderer";

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

function Calendar({ data }) {
  return (
    <View style={{ flexDirection: "column", alignItems: "center" }}>
      <Text style={{ color: data.isWeekend || data.isJourFerie ? "grey" : "black" }}>{data.dayOfWeek}</Text>
      <Text style={{ color: data.isWeekend || data.isJourFerie ? "grey" : "black" }}>{data.nbOfday}</Text>
      <Text style={{ color: "black" }}>{data.cra}</Text>
    </View>
  );
}

export function DocumentCRA({ cra, user }) {
  const mois = monthText[cra.month - 1];

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={{ flexDirection: "row", backgroundColor: "#E4E4E4" }}>
        <View style={{ margin: 10, padding: 10, width: "97%", fontSize: "12pt" }}>
          <Text style={{ textAlign: "center", marginBottom: "40px" }}>COMPTE RENDU D’ACTIVITÉ</Text>
          <Text>{`${mois} ${cra.year}`}</Text>
          <Text>Prénom & Nom : {user.displayName}</Text>
          <Text>{`Client : ${cra.client}`}</Text>
          <Text style={{ marginTop: "10pt" }}>{`${cra.total} jours travaillés en ${mois}`}</Text>
          <View
            style={{
              width: "100%",
              justifyContent: "space-around",
              margin: "20pt 0px"
            }}
          >
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                width: "100%",
                justifyContent: "space-around",
                border: "1pt solid grey",
                padding: "2pt"
              }}
              wrap
            >
              {cra.calendar.map((c, index) => (
                <Calendar key={c.id || index} data={c} />
              ))}
            </View>
            <View style={{ margin: "2pt 0px" }}>
              <Text>1 journée complète et 0,5 pour une demi-journée</Text>
            </View>
          </View>
          <Text style={{ paddingBottom: "1pt" }}>Commentaire :</Text>
          <Text style={{ border: "1pt solid grey", padding: "3pt", minHeight: "42pt", width: "60%" }}>
            {cra.commentaire}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
