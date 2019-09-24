import React, { useEffect, useState } from "react";
import { db, extractQuery } from "../FirebaseHelper";
import { TextField, CardHeader, CardContent } from "@material-ui/core";
import { Card, Header } from "../CommonUi";

const AdminQuickbook = ({ user, handleChange }) => {
  return (
    <Card>
      <CardHeader title="Quickbooks" />
      <CardContent>
        <div>
          <TextField
            defaultValue={user.quickbook ? user.quickbook.clientId : ""}
            onChange={handleChange("quickbook.clientId")}
            label="client id"
          />
        </div>
        <div>
          <TextField
            defaultValue={user.quickbook ? user.quickbook.clientSecret : ""}
            onChange={handleChange("quickbook.clientSecret")}
            label="client secret"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export function User({ match }) {
  const [user, setUser] = useState();

  useEffect(() => {
    const getUser = () =>
      db()
        .collection("users")
        .doc(match.params.id)
        .get()
        .then(extractQuery)
        .then(setUser);
    getUser();
  }, [match.params.id]);
  const handleChange = field => e => {
    db()
      .collection("users")
      .doc(user.id)
      .update({ [field]: e.target.value });
  };
  return (
    <div>
      {user && (
        <div>
          <Header title={user.info.displayName} />

          <AdminQuickbook user={user} handleChange={handleChange} />
        </div>
      )}
    </div>
  );
}
