import React from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { useAuth, UserProvider } from "../UserHelper";
import { Theme } from "../Theme";
import { CRAS } from "../CRA";
import { Login } from "../Login";
import { NavLink } from "../CommonUi/NavLink";
import { Dashboard } from "../Dashboard";
import { NoteDeFrais } from "../NDF";
import { IK } from "../IK";
import { Charges } from "../Charges";
import { Avatar } from "../CommonUi/Avatar";
import { Flex } from "rebass";

function Menu() {
  return (
    <Flex flexWrap="wrap">
      <NavLink exact to="/">
        Dashboard
      </NavLink>
      <NavLink to="/cra">CRA</NavLink>
      <NavLink to="/ndf">NDF</NavLink>
      <NavLink to="/ik">IK</NavLink>
      <NavLink to="/charges">CHARGES</NavLink>
    </Flex>
  );
}

export function App() {
  const { authUser, isSignedOutUser } = useAuth();

  if (isSignedOutUser) {
    return (
      <Router>
        <Redirect to="/login" />
      </Router>
    );
  }

  return (
    <UserProvider value={authUser}>
      <Theme>
        <Router>
          <Flex
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            bg="#d0d0d087"
            p={1}
          >
            <Menu />
            <Flex mr={2} alignItems="center">
              <Avatar src={authUser && authUser.photoURL} m={2} />
              <p>{authUser && authUser.displayName}</p>
            </Flex>
          </Flex>
          <main>
            <Route exact path="/" component={Dashboard} />
            <Route path="/login" component={Login} />
            <Route path="/cra" component={CRAS} />
            <Route path="/ndf" component={NoteDeFrais} />
            <Route path="/ik" component={IK} />
            <Route path="/charges" component={Charges} />
          </main>
        </Router>
      </Theme>
    </UserProvider>
  );
}
