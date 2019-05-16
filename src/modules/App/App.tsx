import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import firebase from "firebase";
import { Theme } from "../Theme";
import { CRA } from "../CRA";
import { Login } from "../Login";
import { NavLink } from "../CommonUi/NavLink";
import { Dashboard } from "../Dashboard";
import { NoteDeFrais } from "../NDF";
import { IK } from "../IK";
import { Charges } from "../Charges";

function useAuth() {
  const [authUser, setUser] = useState();
  const [isSignedOutUser, setIsSignedOutUser] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        const displayName = user.displayName;
        const email = user.email;
        const emailVerified = user.emailVerified;
        const photoURL = user.photoURL;
        const isAnonymous = user.isAnonymous;
        const uid = user.uid;
        const providerData = user.providerData;
        setUser({
          uid,
          displayName,
          email,
          emailVerified,
          photoURL,
          isAnonymous,
          providerData
        });
      } else {
        setIsSignedOutUser(true);
      }
    });
  }, []);

  return { authUser, isSignedOutUser };
}

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
  const { authUser, isSignedOutUser } = useAuth();
  console.log(authUser);

  if (isSignedOutUser) {
    return (
      <Router>
        <Redirect to="/login" />
      </Router>
    );
  }

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
