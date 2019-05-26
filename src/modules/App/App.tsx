import React from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { useAuth, UserProvider } from "../UserHelper";
import { Theme, blue } from "../Theme";
import { CRAS } from "../CRA";
import { Login } from "../Login";
import { NavLink } from "../CommonUi/NavLink";
import { Dashboard } from "../Dashboard";
import { NoteDeFrais } from "../NDF";
import { IK } from "../IK";
import { Charges } from "../Charges";
import { Avatar } from "../CommonUi";
import { Admin } from "../Admin";
import { Flex, Box, Text } from "rebass";
import { AppBar, Button, Toolbar } from "@material-ui/core";

const LinkMenu = props => (
  <Button size="small" component={NavLink} {...props} />
);

function Menu() {
  return (
    <Flex flexWrap="wrap" mx={-2}>
      <LinkMenu exact to="/">
        Dashboard
      </LinkMenu>
      <LinkMenu to="/cra">CRA</LinkMenu>
      <LinkMenu to="/ndf">NDF</LinkMenu>
      <LinkMenu to="/ik">IK</LinkMenu>
      <LinkMenu to="/charges">CHARGES</LinkMenu>
      <LinkMenu to="/admin">ADMIN</LinkMenu>
    </Flex>
  );
}

function HeaderBar({ authUser }) {
  return (
    <AppBar position="static" style={{ backgroundColor: blue }}>
      <Toolbar variant="dense">
        <Text fontSize={3}>Hipay</Text>
        <Box m={"auto"} />
        <Avatar src={authUser && authUser.photoURL} m={2} />
      </Toolbar>
      <Toolbar variant="dense">
        <Menu />
      </Toolbar>
    </AppBar>
  );
}

function AuthRoute({ isLogged, component: Component, ...props }) {
  return (
    <Route
      render={() => (isLogged ? <Redirect to="/login" /> : <Component />)}
      {...props}
    />
  );
}

export function App() {
  const { authUser, isLogged } = useAuth();

  return (
    <UserProvider value={authUser}>
      <Theme>
        <Router>
          <HeaderBar authUser={authUser} />
          <main>
            <AuthRoute
              exact
              path="/"
              isLogged={isLogged}
              component={Dashboard}
            />
            <Route path="/login" component={Login} />
            <AuthRoute path="/admin" isLogged={isLogged} component={Admin} />
            <AuthRoute path="/cra" isLogged={isLogged} component={CRAS} />
            <AuthRoute
              path="/ndf"
              isLogged={isLogged}
              component={NoteDeFrais}
            />
            <AuthRoute path="/ik" isLogged={isLogged} component={IK} />
            <AuthRoute
              path="/charges"
              isLogged={isLogged}
              component={Charges}
            />
          </main>
        </Router>
      </Theme>
    </UserProvider>
  );
}
