import React, { useState, useEffect } from "react";

import { Button } from "@material-ui/core";
import { DisplayData } from "./DisplayData";
import { useUserContext } from "../UserHelper";
import { QUICKBOOK_AUTH, QUICKBOOK_COMPANY } from "../constants";

async function quickBookLogin() {
  const data = await fetch(QUICKBOOK_AUTH).then(res => res.json());
  return data.authUri;
}

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
  if (quickbookObj.createdAt > (quickbookStorage.createdAt || 0)) {
    setQuickbookObj(quickbookObj);
    localStorage.setItem("quickbook", JSON.stringify(quickbookObj));
  }
}

export function Dashboard({ location }) {
  const [quickBooksUri, setQuickBooksUri] = useState(null);
  const [quickBooksLogged, setQuickBooksLogged] = useState(false);
  const [quickookObj, setQuickbookObj] = useState<{
    token?: string;
    realmId?: string;
  }>({});
  const user = useUserContext();
  const quickbookStorage = JSON.parse(
    localStorage.getItem("quickbook") || "{}"
  );
  if (quickbookStorage && quickbookStorage.token !== quickookObj.token) {
    setQuickbookObj(quickbookStorage);
  }
  if (location.search) {
    storeToken(location.search, quickbookStorage, setQuickbookObj);
  }
  useEffect(() => {
    if (user && quickookObj && quickookObj.token) {
      setQuickBooksLogged(true);
    } else {
      quickBookLogin().then(uri => setQuickBooksUri(uri));
    }
  }, [quickookObj, user]);
  useEffect(() => {
    if (quickookObj.token) {
      fetch(QUICKBOOK_COMPANY(quickookObj.token, quickookObj.realmId));
    }
  }, [quickookObj]);
  return (
    <React.Fragment>
      {quickBooksLogged && <DisplayData />}
      {!quickBooksLogged && quickBooksUri && (
        <Button>
          <a href={quickBooksUri}>Connect to quickbook</a>
        </Button>
      )}
    </React.Fragment>
  );
}
