import React from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
type ThemeProp = {
  children: any;
};

export const blue = "#0d577c";
export const lightgray = "#f6f6ff";
export const black = "rgb(72, 72, 72)";
export const red = "#E94D4D";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#E94D4D"
    },
    secondary: {
      main: "#0d577c"
    }
  }
});

export function Theme({ children }: ThemeProp) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
