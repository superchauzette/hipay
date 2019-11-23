import React from "react";

import { red, blue } from "../Theme";

const colors = {
  red: red,
  blue: blue
};

type ColorField = "red" | "blue";

export function InColor({
  children,
  color
}: {
  children: React.ReactNode;
  color: ColorField;
}) {
  return (
    <span
      style={{
        color: colors[color]
      }}
    >
      {" "}
      {children}
    </span>
  );
}
