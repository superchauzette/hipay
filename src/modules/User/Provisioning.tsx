import React, { useState, useEffect } from "react";
import { db, extractQuery } from "../FirebaseHelper";
import {
  CardHeader,
  CardContent,
  TextField,
  CardActions,
  Button
} from "@material-ui/core";
import { Card } from "../CommonUi";
import { months } from "../constants";
import { times } from "lodash";
import { useYearChange, YearSelector } from "../CommonUi/YearSelector";
import { Check, CheckCircle } from "@material-ui/icons";

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
  const [isSave, setIsSave] = useState(false);

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
          setIsSave(true);
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
          .then(() => setIsSave(true))
          .catch(e => console.log(e));
      } else {
        db()
          .collection("provisioning")
          .add(provisioning)
          .then(() => setIsSave(true))
          .catch(e => console.log(e));
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
      <CardHeader
        title={
          <div>
            {months[month]}
            {isSave && (
              <div style={{ float: "right" }}>
                <CheckCircle color="secondary" />
              </div>
            )}
          </div>
        }
      ></CardHeader>

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

export const Provisioning = ({ user }) => {
  const { year, handleChangeYear } = useYearChange();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  return (
    <Card>
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
