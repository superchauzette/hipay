import React from "react";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import styled from "styled-components";
import { position } from "styled-system";
import { CircularProgress } from "@material-ui/core";

function BtnAddC(props) {
  return (
    <div {...props}>
      <Fab
        aria-label="Add"
        onClick={props.loading ? () => {} : props.onClick}
        style={{ backgroundColor: "#07c", color: "white" }}
      >
        {props.loading ? <CircularProgress /> : <AddIcon />}
      </Fab>
    </div>
  );
}

const BtnAddStyled = styled(BtnAddC)`
  ${position}
`;

export const BtnAdd = props => (
  <BtnAddStyled
    position="fixed"
    bottom={["70px", "30px"]}
    right="30px"
    {...props}
  />
);
