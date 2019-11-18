import React, { useEffect, useState } from "react";
import { db, extractQuery } from "../FirebaseHelper";
import { times } from "lodash";
import {
  TextField,
  CardHeader,
  CardContent,
  Button,
  CardActions
} from "@material-ui/core";
import { Card, Header } from "../CommonUi";
import { YearSelector, useYearChange } from "../CommonUi/YearSelector";
import { months } from "../constants";
import { Redirect } from "react-router";

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

type ProvisioningField =
  | "minTreasury"
  | "hiwayProvision"
  | "accountingProvision";

const ProvisioningForm = ({ year, month, user, currentMonth, currentYear }) => {
  const [provisioning, setProvisioning] = useState({
    minTreasury: 0,
    hiwayProvision: 0,
    accountingProvision: 0,
    year,
    month,
    user: db()
      .collection("users")
      .doc(user.id)
  });

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
    db()
      .collection("provisioning")
      .where("year", "==", year)
      .where("month", "==", month)
      .where(
        "user",
        "==",
        db()
          .collection("users")
          .doc(user.id)
      )
      .get()
      .then(qsnap => {
        if (qsnap.size) {
          setProvisioning(extractQuery(qsnap.docs[0]));
        }
      })
      .then(() => setLoaded(true));
  }, [month, user, year]);

  const saveProvisioning = async () => {
    try {
      const currentProfisioning = await db()
        .collection("provisioning")
        .where("year", "==", year)
        .where("month", "==", month)
        .where(
          "user",
          "==",
          db()
            .collection("users")
            .doc(user.id)
        )
        .get();
      if (currentProfisioning && currentProfisioning.size) {
        currentProfisioning.docs[0].ref
          .update({
            ...provisioning
          })
          .catch(e => console.log(e));
      } else {
        db()
          .collection("provisioning")
          .add(provisioning);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const updateProvisioning = (field: ProvisioningField, value: number) => {
    setProvisioning({ ...provisioning, [field]: value });
  };
  const isCurrentMonth = currentMonth === month && currentYear === year;
  const fieldStyle = { padding: "10px" };
  return (
    <Card
      style={{
        width: "100%",
        background: isCurrentMonth ? "#0077cc57" : "white"
      }}
    >
      <CardHeader title={months[month]}></CardHeader>
      {loaded && (
        <CardContent>
          <TextField
            defaultValue={provisioning.minTreasury}
            label="Minimum treasury"
            onChange={e =>
              updateProvisioning(
                "minTreasury",
                e.target.value ? parseFloat(e.target.value) : 0
              )
            }
            type="number"
            style={fieldStyle}
          />
          <TextField
            defaultValue={provisioning.hiwayProvision}
            onChange={e =>
              updateProvisioning(
                "hiwayProvision",
                e.target.value ? parseFloat(e.target.value) : 0
              )
            }
            label="Hiway provision"
            type="number"
            style={fieldStyle}
          />
          <TextField
            defaultValue={provisioning.accountingProvision}
            onChange={e =>
              updateProvisioning(
                "accountingProvision",
                e.target.value ? parseFloat(e.target.value) : 0
              )
            }
            label="Acounting provision"
            type="number"
            style={fieldStyle}
          />
        </CardContent>
      )}
      <CardActions>
        <Button variant="text" color="primary" onClick={saveProvisioning}>
          Save
        </Button>
      </CardActions>
    </Card>
  );
};

const QuickbookData = ({ user }) => {
  const { year, handleChangeYear } = useYearChange();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  return (
    <Card>
      <CardHeader style={{ textAlign: "center" }} title="Provisioning" />
      <CardContent>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <YearSelector onChange={handleChangeYear} />
        </div>
        {year && (
          <div>
            {times(12).map((_v, key) => (
              <ProvisioningForm
                currentMonth={currentMonth}
                currentYear={currentYear}
                user={user}
                key={key}
                month={key}
                year={year}
              />
            ))}
          </div>
        )}
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
  console.log("USER page", Boolean(user));
  return (
    <div>
      {Boolean(user) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column"
          }}
        >
          <Header title={user.info.displayName} />
          <AdminQuickbook user={user} handleChange={handleChange} />
          <QuickbookData user={user} />
        </div>
      )}
      {!Boolean(user) && <Redirect to="/notfound" />}
    </div>
  );
}
