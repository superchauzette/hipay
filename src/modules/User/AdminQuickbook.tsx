import React, { useState } from "react";
import { db } from "../FirebaseHelper";
import {
  TextField,
  CardHeader,
  CardContent,
} from "@material-ui/core";
import { Card } from "../CommonUi";
import { CheckCircle } from "@material-ui/icons";
import { MiniLoader } from "../CommonUi/MiniLoader";

export const AdminQuickbook = ({ user }) => {
  const [saveState, setSaveState] = useState({
    saved: user.quickbook && user.quickbook.clientId,
    loading: false,
    error: false
  });
  const handleChange = field => e => {
    setSaveState({
      saved: false,
      loading: true,
      error: false
    });
    db()
      .collection("users")
      .doc(user.id)
      .update({ [field]: e.target.value })
      .then(() =>
        setSaveState({
          saved: true,
          loading: false,
          error: false
        })
      )
      .catch(e => {
        setSaveState({
          saved: false,
          loading: false,
          error: true
        });
      });
  };
  return (
    <Card>
      <CardHeader
        title={
          <div>
            Conf
            <div style={{ float: "right" }}>
              {saveState.saved && <CheckCircle color="secondary" />}
              {saveState.loading && <MiniLoader />}
            </div>
          </div>
        }
      />
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
