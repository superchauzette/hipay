import React from "react";
import { NavLink as Link } from "react-router-dom";

export function NavLink(props: any) {
  return (
    <Link
      style={{
        textDecoration: "none",
        color: "rgba(255,255,255,0.6)"
      }}
      activeStyle={{
        fontWeight: "bold",
        color: "white"
      }}
      {...props}
    />
  );
}
