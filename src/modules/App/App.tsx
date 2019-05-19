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
import Button from "@material-ui/core/Button";

const LinkMenu = props => (
  <Button variant="outlined" size="small" component={NavLink} {...props} />
);

function Menu() {
  return (
    <Flex flexWrap="wrap">
      <LinkMenu exact to="/">
        Dashboard
      </LinkMenu>
      <LinkMenu to="/cra">CRA</LinkMenu>
      <LinkMenu to="/ndf">NDF</LinkMenu>
      <LinkMenu to="/ik">IK</LinkMenu>
      <LinkMenu to="/charges">CHARGES</LinkMenu>
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
            p={1}
          >
            <Menu />
            {/* <Flex mr={2} justifyContent="flex-end" width={1}>
              <Avatar src={authUser && authUser.photoURL} m={2} />
            </Flex> */}
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
