import React from "react";
import styled from "styled-components";
import { display, width, space, color, position } from "styled-system";

export const MyBox: any = styled.div`
  ${display}
  ${width}
  ${space}
  ${color}
  ${position}
`;

export const Mobile = props => (
  <MyBox display={["block", "none", "none"]} {...props} />
);

export const Desktop = props => (
  <MyBox display={["none", "block", "block"]} {...props} />
);
