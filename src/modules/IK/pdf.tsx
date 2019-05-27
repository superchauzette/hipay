import React from "react";
import { Page, Text, View, Document } from "@react-pdf/renderer";
import { ikType } from "./types";

type DocumentIkCompProps = {
  iks: ikType[];
  total: number;
  user: any;
};

function Ik({ ik }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
      <Text style={{ width: "16%" }}>{ik.dateIk}</Text>
      <Text style={{ width: "16%" }}>{ik.objectDeplacement}</Text>
      <Text style={{ width: "16%" }}>{ik.lieuDepartArriveeRetour}</Text>
      <Text style={{ width: "16%" }}>{ik.kmParcourus}</Text>
      <Text style={{ width: "16%" }}>{ik.puissanceFiscale}</Text>
      <Text style={{ width: "16%" }}>{ik.montant}</Text>
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

export function DocumentIk({ iks, total, user }: DocumentIkCompProps) {
  const date = formatMonthYear(iks);

  return (
    <Document>
      <Page
        size="A4"
        orientation="landscape"
        style={{ flexDirection: "row", backgroundColor: "#E4E4E4" }}
      >
        <View style={{ margin: 10, padding: 10, width: "97%" }}>
          <Text style={{ textAlign: "center", marginBottom: "40px" }}>
            Indemnités Kilométriques de {date}
          </Text>
          <Text>{user.displayName}</Text>
          <Text style={{ marginBottom: "30px" }}>Total : {total}€</Text>
          <Ik
            ik={{
              dateIk: "date",
              objectDeplacement: "Object Deplacement",
              lieuDepartArriveeRetour: "lieu Depart/Arrivée/Retour",
              kmParcourus: "km Parcourus",
              puissanceFiscale: "Puissance Fiscale",
              montant: "montant"
            }}
          />
          <View style={{ flexDirection: "column", width: "100%" }}>
            {iks.map(ik => (
              <Ik key={ik.id} ik={ik} />
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
}
