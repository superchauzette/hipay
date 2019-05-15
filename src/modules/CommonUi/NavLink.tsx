import React from "react";
import { NavLink as Link } from "react-router-dom";

export function NavLink(props: any) {
  return (
    <Link
      style={{
        margin: "0 20px",
        color: "black",
        border: "none",
        textDecoration: "none"
      }}
      activeStyle={{
        fontWeight: "bold",
        border: "none",
        borderBottom: "3px solid white"
      }}
      {...props}
    />
  );
}
