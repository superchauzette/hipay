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
import { Avatar, Mobile, Desktop } from "../CommonUi";
import { Admin } from "../Admin";
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

const LinkIcon = ({ icon, text, ...props }) => (
  <NavLink {...props}>
    <Flex flexDirection="column" alignItems="center" color="white">
      {icon}
      <Text color="white" fontSize="10px" fontWeight="bold" mt="2px">
        {text}
      </Text>
    </Flex>
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
      bg={blue}
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
      render={routeProps =>
        isLogged ? <Redirect to="/login" /> : <Component {...routeProps} />
      }
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
          <Desktop>
            <HeaderBar authUser={authUser} />
          </Desktop>
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
          <Mobile>
            <MenuMobile />
          </Mobile>
        </Router>
      </Theme>
    </UserProvider>
  );
}
