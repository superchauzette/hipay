import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Theme } from "../Theme";
import { CRA } from "../CRA";
import { Login } from "../Login";
import { NavLink } from "../CommonUi/NavLink";
import "./App.css";
import { Dashboard } from "../Dashboard";
import { NoteDeFrais } from "../NDF";
import { IK } from "../IK";
import { Charges } from "../Charges";

function Menu() {
  return (
    <div style={{ display: "flex" }}>
      <NavLink exact to="/">
        Dashboard
      </NavLink>
      <NavLink to="/cra">CRA</NavLink>
      <NavLink to="/ndk">NDF</NavLink>
      <NavLink to="/ik">IK</NavLink>
      <NavLink to="/charges">CHARGES</NavLink>
    </div>
  );
}

export function App() {
  return (
    <Theme>
      <Router>
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 10px",
            backgroundColor: "#d0d0d087"
          }}
        >
          <Menu />
          <p>Kevin Tillot</p>
        </header>
        <main>
          <Route exact path="/" component={Dashboard} />
          <Route path="/login" component={Login} />
          <Route path="/cra" component={CRA} />
          <Route path="/ndk" component={NoteDeFrais} />
          <Route path="/ik" component={IK} />
          <Route path="/charges" component={Charges} />
        </main>
      </Router>
    </Theme>
  );
}
