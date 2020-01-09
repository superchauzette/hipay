import React, { useState } from "react";
import * as firebase from "firebase/app";
import { auth } from "../FirebaseHelper";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import { Redirect } from "react-router-dom";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Logo from "../../assets/logo.svg";
import { CircularProgress } from "@material-ui/core";
import { InColor } from "../CommonUi/InColor";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://hiway-freelance.com/">
        hiway
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  title: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column"
  }
}));

export function Login() {
  const classes = useStyles();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const signIn = (email: string, password: string) => {
    // setLoading(true);
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        setErrorMessage(errorMessage);
        console.log(errorCode);
        console.log(errorMessage);
        // ...
      })
      .finally(() => {
        console.log("tricj");
        // setLoading(false);
      });
  };
  if (auth().currentUser) {
    return <Redirect to="/" />;
  }
  return (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <div className={classes.title}>
            <img width="60px" src={Logo} alt="logo-hiway" />
            <Typography
              style={{ padding: "0 10px", marginTop: "15px" }}
              component="h1"
              variant="h5"
            >
              Bienvenue sur le Portail <InColor color="red">Hiway</InColor>
            </Typography>
            <Typography variant="caption" style={{ marginTop: "15px" }}>
              Connectez-vous avec vos identifiants communiqués par Hiway
            </Typography>
          </div>
          <form
            className={classes.form}
            onSubmit={e => {
              e.preventDefault();
              setErrorMessage("");
              signIn(login, password);
            }}
          >
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Addresse email"
              name="email"
              autoComplete="email"
              onChange={e => setLogin(e.target.value)}
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              onChange={e => setPassword(e.target.value)}
              id="password"
              autoComplete="current-password"
            />

            <Button
              type="submit"
              fullWidth
              disabled={loading}
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {!loading && <>Connexion</>}
              {loading && <CircularProgress size={24} />}
            </Button>
            <Typography
              style={{ textAlign: "center" }}
              color="error"
              variant="body1"
            >
              {errorMessage}
            </Typography>
            {/* <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid> */}
          </form>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    </>
  );
}
