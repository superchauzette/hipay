import React from "react";
import { ThemeProvider } from "styled-components";

type ThemeProp = {
  children: any;
};

const blue = "#07c";
const lightgray = "#f6f6ff";

const theme = {
  fontSizes: [12, 14, 16, 24, 32, 48, 64],
  colors: {
    blue,
    lightgray
  },
  buttons: {
    primary: {
      color: "#fff",
      backgroundColor: blue
    },
    outline: {
      color: blue,
      backgroundColor: "transparent",
      boxShadow: "inset 0 0 2px"
    }
  }
};

export function Theme({ children }: ThemeProp) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
