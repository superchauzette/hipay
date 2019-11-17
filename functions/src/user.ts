import * as express from "express";
import * as bodyParser from "body-parser";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import * as cors from "cors";

const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/", (req, res) => {
  const user = JSON.parse(req.body);
  console.log("req", { ...user });
  console.log("USER", user);
  admin
    .auth()
    .createUser({
      emailVerified: true,
      disabled: false,
      ...user
    })
    .then(u => {
      res.status(200).send(u);
    })
    .catch(error => {
      res.status(500).send(error);
    });
});

app.get("/:email", async (req, res) => {
  const { email } = req.params;
  const user = await admin.auth().getUserByEmail(email);
  res.status(200).send(user);
});

export const users = functions.https.onRequest(app);
