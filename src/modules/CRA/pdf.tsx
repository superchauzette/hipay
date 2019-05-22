import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  PDFDownloadLink
} from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4"
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});

// Create Document Component
const MyDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Section #1</Text>
      </View>
      <View style={styles.section}>
        <Text>Section #2</Text>
      </View>
    </Page>
  </Document>
);

export const LinkPdf = () => (
  <div>
    <PDFDownloadLink document={<MyDocument />} fileName="cra.pdf">
      {({ blob, url, loading, error }) =>
        loading ? "Loading document..." : "Download CRA"
      }
    </PDFDownloadLink>
  </div>
);

export const Viewer = () => (
  <PDFViewer style={{ width: "100vw", height: "100vh" }}>
    <MyDocument />
  </PDFViewer>
);
