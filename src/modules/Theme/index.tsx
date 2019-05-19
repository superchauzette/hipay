import React from "react";
import { ThemeProvider } from "styled-components";

type ThemeProp = {
  children: any;
};

const blue = "#07c";
const lightgray = "#f6f6ff";
const black = "rgb(72, 72, 72)";

const theme = {
  fontSizes: [12, 14, 16, 24, 32, 48, 64],
  colors: {
    blue,
    lightgray,
    black
  },
  fonts: {
    sans: "Roboto",
    mono: "Roboto"
  },
  buttons: {
    primary: {
      color: "#fff",
      backgroundColor: blue,
      ouline: "none"
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
