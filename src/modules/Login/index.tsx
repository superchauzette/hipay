import React from "react";
import firebase from "firebase/app";
import { Redirect } from "react-router";
import { Button } from "@material-ui/core";
import { Flex } from "rebass";

export function Login() {
  const [user, setUser] = React.useState();

  if (user) {
    return <Redirect to="/" />;
  }

  async function doLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    await firebase.auth().signInWithRedirect(provider);
    const result = await firebase.auth().getRedirectResult();
    // const token = result.credential && result.credential.accessToken;
    const user = result.user;
    setUser(user);
  }

  return (
    <Flex p={3} flexDirection="column">
      <h1>Login</h1>
      <div>
        <Button onClick={doLogin} color="primary" variant="raised">
          Google Login
        </Button>
      </div>
    </Flex>
  );
}
