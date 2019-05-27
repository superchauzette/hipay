import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flewWrap: "wrap",
    width: "100%",
    justifyContent: "space-around"
  }
});

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
      <Text
        style={{ color: data.isWeekend || data.isJourFerie ? "grey" : "black" }}
      >
        {data.dayOfWeek}
      </Text>
      <Text>{data.nbOfday}</Text>
      <Text style={{ color: "red" }}>{data.cra}</Text>
    </View>
  );
}

export function DocumentCRA({ cra, user }) {
  const firstQuainzaine = cra.calendar
    ? cra.calendar.filter(c => c.nbOfday < 16)
    : [];
  const lastQuainzaine = cra.calendar
    ? cra.calendar.filter(c => c.nbOfday >= 16)
    : [];
  const mois = monthText[cra.month - 1];

  return (
    <Document>
      <Page
        size="A4"
        orientation="landscape"
        style={{ flexDirection: "row", backgroundColor: "#E4E4E4" }}
      >
        <View style={{ margin: 10, padding: 10, width: "97%" }}>
          <Text style={{ textAlign: "center", marginBottom: "40px" }}>
            COMPTE RENDU D’ACTIVITÉ
          </Text>
          <Text>{user.displayName}</Text>
          <Text>{`CRA pour ${cra.client} de ${mois} ${cra.year}`}</Text>
          <Text style={{ marginTop: "10px" }}>
            {`${cra.total} jours travaillés en ${mois}`}
          </Text>
          <View
            style={{
              width: "100%",
              justifyContent: "space-around",
              margin: "20px 0px"
            }}
          >
            <View style={styles.row} wrap>
              {firstQuainzaine.map(c => (
                <Calendar key={c.id} data={c} />
              ))}
            </View>
            <View style={styles.row} wrap>
              {lastQuainzaine.map(c => (
                <Calendar key={c.id} data={c} />
              ))}
            </View>
          </View>
          <Text>Commentaire : {cra.commentaire}</Text>
        </View>
      </Page>
    </Document>
  );
}
