import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Icon from "@material-ui/icons/CloudDownload";
import { Button } from "@material-ui/core";
import { blue } from "../Theme";

const LinkPdfComponent = props =>
  props.disabled ? (
    <Button variant="outlined" disabled={props.disabled}>
      <Icon style={{ marginRight: "6px" }} />
      {props.label || "Imprimer"}
    </Button>
  ) : (
    <PDFDownloadLink
      style={{
        textDecoration: props.title ? "underline" : "none",
        color: blue
      }}
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
            {props.label || "Imprimer"}
          </Button>
        )
      }
    </PDFDownloadLink>
  );

export const LinkPdf = LinkPdfComponent;
