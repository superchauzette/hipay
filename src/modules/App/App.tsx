import React from "react";
import * as firebase from "firebase/app";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { useAuth, UserProvider } from "../UserHelper";
import { Theme, red } from "../Theme";
import { CRAS } from "../CRA";
import { Login } from "../Login/Login";
import { CreateAccountForm } from "../User/CreateAccountForm";

import { NavLink } from "../CommonUi/NavLink";
import { Dashboard } from "../Dashboard";
import { NoteDeFrais } from "../NDF";
import { IK } from "../IK";
import { Charges } from "../Charges";
import { Avatar, Mobile, Desktop } from "../CommonUi";
import { Admin } from "../Admin";
import { User } from "../User";
import { Flex, Box, Text } from "rebass";
import { AppBar, Button, Toolbar } from "@material-ui/core";
import {
  Home,
  Restaurant,
  CalendarToday,
  MonetizationOn,
  DirectionsCar,
  Face
} from "@material-ui/icons";
import { useIsAdmin } from "../FirebaseHelper";

const LinkMenu = props => (
  <Button size="small" component={NavLink} {...props} />
);

export const IconText = ({ icon, text, color = "white", ...props }) => (
  <Flex flexDirection="column" alignItems="center" color={color} {...props}>
    {icon}
    <Text color={color} fontSize="10px" fontWeight="bold" mt="2px">
      {text}
    </Text>
  </Flex>
);

export const LinkIcon = ({ icon, text, ...props }) => (
  <NavLink {...props}>
    <IconText icon={icon} text={text} />
  </NavLink>
);

function MenuMobile() {
  const isAdmin = useIsAdmin();
  return (
    <Flex
      width="100%"
      style={{
        position: "fixed",
        bottom: 0,
        boxShadow: "rgba(0, 0, 0, 0.25) 0px -5px 16px"
      }}
      p={2}
      justifyContent="space-around"
      bg={red}
    >
      <LinkIcon exact to="/" icon={<Home />} text="HOME" />
      <LinkIcon to="/cra" icon={<CalendarToday />} text="CRA" />
      <LinkIcon to="/ndf" icon={<Restaurant />} text="NDF" />
      <LinkIcon to="/ik" icon={<DirectionsCar />} text="IK" />
      <LinkIcon to="/CHARGES" icon={<MonetizationOn />} text="CHARGES" />
      {isAdmin && <LinkIcon to="/admin" icon={<Face />} text="ADMIN" />}
    </Flex>
  );
}

function Menu() {
  const isAdmin = useIsAdmin();

  return (
    <Flex flexWrap="wrap" mx={-2}>
      <LinkMenu exact to="/">
        Dashboard
      </LinkMenu>
      <LinkMenu to="/cra">CRA</LinkMenu>
      <LinkMenu to="/ndf">NDF</LinkMenu>
      <LinkMenu to="/ik">IK</LinkMenu>
      <LinkMenu to="/charges">CHARGES</LinkMenu>
      {isAdmin && <LinkMenu to="/admin">ADMIN</LinkMenu>}
    </Flex>
  );
}

function HeaderBar({ authUser }) {
  return (
    <AppBar position="static" color="primary">
      <Toolbar variant="dense">
        <Text fontSize={3}>Hipay</Text>
        <Box m={"auto"} />
        <Avatar src={authUser && authUser.photoURL} m={2} />
        <Button
          onClick={() => {
            firebase.auth().signOut();
          }}
          color="inherit"
          variant="text"
        >
          Déconnexion
        </Button>
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
      render={routeProps =>
        isLogged ? <Redirect to="/login" /> : <Component {...routeProps} />
      }
      {...props}
    />
  );
}

export function App() {
  const { authUser, isLoggedOut } = useAuth();
  const currentUser = firebase.auth().currentUser;

  return (
    <UserProvider value={authUser}>
      <Theme>
        <Router>
          {currentUser && (
            <Desktop>
              <HeaderBar authUser={authUser} />
            </Desktop>
          )}
          <main>
            <AuthRoute
              exact
              path="/"
              isLogged={isLoggedOut}
              component={Dashboard}
            />
            <Route path="/login" component={Login} />
            <AuthRoute
              exact
              path="/admin/users/create"
              isLogged={isLoggedOut}
              component={CreateAccountForm}
            />
            <AuthRoute
              exact
              path="/admin"
              isLogged={isLoggedOut}
              component={Admin}
            />

            <AuthRoute
              path="/user/:id"
              isLogged={isLoggedOut}
              component={User}
            />
            <AuthRoute path="/cra" isLogged={isLoggedOut} component={CRAS} />
            <AuthRoute
              path="/ndf"
              isLogged={isLoggedOut}
              component={NoteDeFrais}
            />
            <AuthRoute path="/ik" isLogged={isLoggedOut} component={IK} />
            <AuthRoute
              path="/charges"
              isLogged={isLoggedOut}
              component={Charges}
            />
          </main>
          {currentUser && (
            <Mobile>
              <MenuMobile />
            </Mobile>
          )}
        </Router>
      </Theme>
    </UserProvider>
  );
}
