import React from "react";
import firebase from "firebase";
import { Redirect } from "react-router";

async function useLogin() {
  const [user, setUser] = React.useState();
  async function doLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await firebase.auth().signInWithPopup(provider);
    // const token = result.credential && result.credential.accessToken;
    const user = result.user;
    setUser(user);
  }

  React.useEffect(() => {
    doLogin();
  }, []);

  return user;
}

export function Login() {
  const user = useLogin();

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div>
      <h1>Login </h1>
    </div>
  );
}
