import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import * as firebase from "firebase/app";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { db } from "../FirebaseHelper";

import Checkbox from "@material-ui/core/Checkbox";
import { Card, CardContent, CardActions, Button } from "@material-ui/core";

type User = {
  firstName?: string;
  lastname?: string;
  email?: string;
  password?: string;
  isAdmin?: boolean;
  clientId?: string;
  clientSecret?: string;
};

type Field = keyof User;

export function CreateAccountForm() {
  const [user, setUser] = useState<User | null>({});
  const createUser = () => {
    if (user && user.email && user.password) {
      fetch(`https://us-central1-hipay-42.cloudfunctions.net/users/`, {
        method: "POST",
        body: JSON.stringify({
          email: user.email,
          displayName: `${user.firstName} ${user.lastname}`,
          password: user.password
        })
      })
        .then(res => {
          if (user.isAdmin && res.status === 200) {
            db()
              .collection("admin")
              .add({ email: user.email });
          } else {
            throw new Error("Cant create account");
          }
          return res.json();
        })
        .then(data => {
          db()
            .collection("users")
            .doc(data.uid)
            .set(
              {
                info: data,
                quickbook: {
                  clientId: user.clientId,
                  clientSecret: user.clientSecret
                }
              },
              { merge: true }
            );
        })
        .catch(() => console.log("ERROR DE CREATION"));
    }
  };
  const handleFieldChange = (field: Field) => value => {
    const u = user || {};
    setUser({
      ...u,
      [field]: value
    });
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createUser();
  };
  return (
    <form onSubmit={handleSubmit}>
      <Card style={{ margin: "20px 40px" }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Création compte hipay
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                onChange={e => handleFieldChange("firstName")(e.target.value)}
                id="firstName"
                name="firstName"
                label="First name"
                fullWidth
                autoComplete="fname"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                onChange={e => handleFieldChange("lastname")(e.target.value)}
                id="lastName"
                name="lastName"
                label="Last name"
                fullWidth
                autoComplete="lname"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                type="email"
                onChange={e => handleFieldChange("email")(e.target.value)}
                required
                id="email"
                name="email"
                label="email"
                fullWidth
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="password"
                onChange={e => handleFieldChange("password")(e.target.value)}
                required
                id="password"
                name="password"
                label="password"
                fullWidth
                autoComplete="password"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={e =>
                      handleFieldChange("isAdmin")(e.target.checked)
                    }
                    color="secondary"
                    name="saveAddress"
                    value="yes"
                  />
                }
                label="Admin"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Quickbooks</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="clientId"
                onChange={e => handleFieldChange("clientId")(e.target.value)}
                required
                id="clientId"
                name="clientId"
                label="clientId"
                fullWidth
                autoComplete="clientId"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="clientSecret"
                onChange={e =>
                  handleFieldChange("clientSecret")(e.target.value)
                }
                required
                id="clientSecret"
                name="clientSecret"
                label="clientSecret"
                fullWidth
                autoComplete="clientSecret"
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button type="submit" variant="contained" color="secondary">
            Créer
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}
