import React from "react";
import { NavLink as Link } from "react-router-dom";

export function NavLink(props: any) {
  return (
    <Link
      style={{
        margin: "0 5px 5px",
        textDecoration: "none"
      }}
      activeStyle={{
        fontWeight: "bold",
        color: "#07c",
        borderColor: "#07c"
      }}
      {...props}
    />
  );
}
