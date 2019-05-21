import React from "react";
import { Redirect } from "react-router";
import { Button } from "@material-ui/core";
import { Flex } from "rebass";
import { auth, googleAuth } from "../FirebaseHelper";

export function Login() {
  if (auth().currentUser) {
    return <Redirect to="/" />;
  }

  async function doLogin() {
    await googleAuth();
  }

  return (
    <Flex p={3} flexDirection="column">
      <h1>Login</h1>
      <div>
        <Button onClick={doLogin} color="primary" variant="contained">
          Google Login
        </Button>
      </div>
    </Flex>
  );
}
