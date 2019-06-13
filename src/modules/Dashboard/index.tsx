import React, { useState, useEffect } from "react";

import { Button } from "@material-ui/core";
import { DisplayData } from "./DisplayData";
import { useUserContext } from "../UserHelper";
import { QUICKBOOK_AUTH, QUICKBOOK_COMPANY } from "../constants";
import quickbooksLogo from "./qbLogo.png";

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

export function Dashboard({ location, history }) {
  const [quickBooksLogged, setQuickBooksLogged] = useState(false);
  const [quickbookObj, setQuickbookObj] = useState<{
    token: string;
    realmId: string;
    expireAt: number;
  } | null>(null);
  const user = useUserContext();
  const quickbookStorage = JSON.parse(
    localStorage.getItem("quickbook") || "null"
  );
  if (quickbookStorage && !quickbookObj) {
    if (
      quickbookStorage.expireAt < new Date().getTime() &&
      quickbookStorage.refreshExpireAt < new Date().getTime()
    ) {
      fetch(
        `https://us-central1-hipay-42.cloudfunctions.net/quickbooksApi/refreshAccessToken?refreshAccessToken=${
          quickbookStorage.refreshToken
        }`
      )
        .then(res => res.json())
        .then(newTokenObj => {
          const newTokenStorage = {
            ...quickbookStorage,
            ...newTokenObj
          };
          setQuickbookObj(newTokenStorage);
          localStorage.setItem("quickbook", JSON.stringify(newTokenStorage));
          console.log(newTokenStorage);
        })
        .catch(() => localStorage.removeItem("quickbook"));
    } else {
      setQuickbookObj(quickbookStorage);
    }
  }
  if (location.search) {
    storeToken(location.search, quickbookStorage, setQuickbookObj);
    history.replace("/");
  }
  useEffect(() => {
    if (user && quickbookObj && quickbookObj.token) {
      setQuickBooksLogged(true);
    }
  }, [quickbookObj, user]);
  return (
    <React.Fragment>
      {quickBooksLogged && <DisplayData quickbookObj={quickbookObj} />}
      {!quickBooksLogged && (
        <div style={{ marginTop: "70px", textAlign: "center" }}>
          <div style={{ marginBottom: "20px" }}>
            Afin de récupérer vos informations bancaires vous devez vous
            connecter avec les compte donnés par Hiway sur Quickbooks
          </div>
          <Button>
            <a
              style={{ textDecoration: "none" }}
              href="https://us-central1-hipay-42.cloudfunctions.net/quickbooksApi/authUri"
            >
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
    </React.Fragment>
  );
}
