import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Icon from "@material-ui/icons/CloudDownload";
import { Button } from "@material-ui/core";

export const LinkPdf = props => (
  <PDFDownloadLink style={{ textDecoration: "none" }} {...props}>
    {({ loading }) =>
      loading ? (
        "...Loading"
      ) : (
        <Button variant="outlined">
          <Icon style={{ marginRight: "6px" }} />
          Download
        </Button>
      )
    }
  </PDFDownloadLink>
);
