import React, { useState, useEffect } from "react";

import { Button } from "@material-ui/core";
import { DisplayData } from "./DisplayData";
import { useUserContext } from "../UserHelper";
import quickbooksLogo from "./qbLogo.png";
import { db, extractQuery } from "../FirebaseHelper";

function storeToken(search, quickbookStorage, setQuickbookObj) {
  const params = new URLSearchParams(search);
  const quickbookObj = {
    token: params.get("token"),
    expireAt: parseInt(params.get("expireAt") || "0"),
    refreshToken: params.get("refreshToken"),
    refreshExpireAt: parseInt(params.get("refreshExpireAt") || "0"),
    createdAt: parseInt(params.get("createdAt") || "0"),
    realmId: params.get("realmId")
  };
  if (
    quickbookObj.createdAt > (quickbookStorage ? quickbookStorage.createdAt : 0)
  ) {
    setQuickbookObj(quickbookObj);
    localStorage.setItem("quickbook", JSON.stringify(quickbookObj));
  }
}

const useProvisioning = user => {
  const [provisioning, setProvisioning] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  useEffect(() => {
    if (user) {
      setLoaded(false);
      db()
        .collection("provisioning")
        .where("year", "==", currentYear)
        .where("month", "==", currentMonth)
        .where(
          "user",
          "==",
          db()
            .collection("users")
            .doc(user.uid)
        )
        .get()
        .then(qsnap => {
          console.log(qsnap.size);
          if (qsnap.size) {
            setProvisioning(extractQuery(qsnap.docs[0]));
          }
          setLoaded(true);
        })
        .catch(() => setLoaded(true));
    }
  }, [currentMonth, currentYear, user]);
  return [provisioning, loaded];
};

export function Dashboard({ location, history }) {
  const [quickBooksLogged, setQuickBooksLogged] = useState(false);
  const [quickbookObj, setQuickbookObj] = useState<{
    token: string;
    realmId: string;
    expireAt: number;
  } | null>(null);
  const user = useUserContext();
  const [provisioning, provisioningLoaded] = useProvisioning(user);

  useEffect(() => {
    if (user && provisioning) {
      const quickbookStorage = JSON.parse(
        localStorage.getItem("quickbook") || "null"
      );
      if (quickbookStorage && !quickbookObj) {
        if (quickbookStorage.expireAt < new Date().getTime()) {
          if (quickbookStorage.refreshExpireAt > new Date().getTime()) {
            fetch(
              `https://us-central1-hipay-42.cloudfunctions.net/quickbooksApi/refreshAccessToken?refreshAccessToken=${quickbookStorage.refreshToken}&userId=${user.uid}`
            )
              .then(res => res.json())
              .then(newTokenObj => {
                const newTokenStorage = {
                  ...quickbookStorage,
                  ...newTokenObj
                };
                setQuickbookObj(newTokenStorage);
                localStorage.setItem(
                  "quickbook",
                  JSON.stringify(newTokenStorage)
                );
                console.log(newTokenStorage);
              })
              .catch(() => localStorage.removeItem("quickbook"));
          } else {
            localStorage.removeItem("quickbook");
          }
        } else {
          setQuickbookObj(quickbookStorage);
        }
      }
      if (location.search) {
        storeToken(location.search, quickbookStorage, setQuickbookObj);
        history.replace("/");
      }
    }
  }, [history, location.search, provisioning, quickbookObj, user]);

  useEffect(() => {
    if (user && quickbookObj && quickbookObj.token) {
      setQuickBooksLogged(true);
    }
  }, [quickbookObj, user]);
  const hasNotProvisioning = provisioningLoaded && !provisioning;
  return (
    <React.Fragment>
      {quickbookObj && quickBooksLogged && provisioning && (
        <DisplayData quickbookObj={quickbookObj} provisioning={provisioning} />
      )}
      {!quickBooksLogged && user && !hasNotProvisioning && (
        <div style={{ marginTop: "70px", textAlign: "center" }}>
          <div style={{ marginBottom: "20px" }}>
            Afin de récupérer vos informations bancaires vous devez vous
            connecter avec les compte donnés par Hiway sur Quickbooks
          </div>
          <Button>
            <a
              style={{ textDecoration: "none" }}
              href={`https://us-central1-hipay-42.cloudfunctions.net/quickbooksApi/authUri?userId=${user.uid}`}>
              <Button variant="raised">
                <img
                  style={{ display: "inline-block", marginRight: "10px" }}
                  width="15px"
                  src={quickbooksLogo}
                  alt="quickbooks logo"
                />
                {"   "}Se connecter a quickbooks
              </Button>
            </a>
          </Button>
        </div>
      )}
      {hasNotProvisioning && (
        <div style={{ marginTop: "70px", textAlign: "center" }}>
          <div style={{ marginBottom: "20px" }}>
            Les données relative a votre mois n'ont pas encore été saisi,
            veuillez revenir plus tard pour voir votre dashboard
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
