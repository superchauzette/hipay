import React from "react";
import { ThemeProvider } from "styled-components";

type ThemeProp = {
  children: any;
};

export const blue = "#07c";
export const lightgray = "#f6f6ff";
export const black = "rgb(72, 72, 72)";
export const red = "rgb(225, 0, 80)";

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
