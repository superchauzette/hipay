import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Icon from "@material-ui/icons/CloudDownload";
import { Button } from "@material-ui/core";

const LinkPdfComponent = props => (
  <PDFDownloadLink
    style={{ textDecoration: props.title ? "underline" : "none" }}
    {...props}
  >
    {({ loading }) =>
      loading ? (
        "...Loading"
      ) : props.title ? (
        props.title
      ) : (
        <Button variant="outlined">
          <Icon style={{ marginRight: "6px" }} />
          Download
        </Button>
      )
    }
  </PDFDownloadLink>
);

export const LinkPdf = React.memo(LinkPdfComponent, () => true);
