import React, { useState, useEffect, createContext, useContext } from "react";
import { auth, db } from "../FirebaseHelper";
import { FiscValue } from "../User/FiscAdmin";

export type userType = {
  uid: string;
  displayName: string | null;
  email: string | null;
  emailVerified: boolean;
  photoURL: string | null;
  isAnonymous: boolean;
  providerData: (firebase.UserInfo | null)[];
  fisc?: {
    cipav?: FiscValue;
    urssaf?: FiscValue;
    tva?: FiscValue;
  };
  quickbook?: {
    clientId?: string;
    clientSecret: string;
  };
};

const contextUser = createContext({} as userType);

export const UserProvider = props => <contextUser.Provider {...props} />;

export const useUserContext = () => useContext<userType>(contextUser);

export function extractUser(user) {
  const photoURL = user.photoURL;
  const isAnonymous = user.isAnonymous;
  const providerData = user.providerData;

  return {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    emailVerified: user.emailVerified,
    photoURL,
    isAnonymous,
    providerData,
    fisc: user.fisc,
    quickbook: user.quickbook
  };
}

export function useAuth() {
  const [authUser, setUser] = useState(undefined as userType | undefined);
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  useEffect(() => {
    auth().onAuthStateChanged(async function(user) {
      if (user) {
        setIsLoggedOut(false);
        // User is signed in.
        const data: userType = extractUser(user);
        const dbUser = await db()
          .collection("users")
          .doc(user.uid)
          .get();

        setUser(extractUser(dbUser.data()));
      } else {
        setIsLoggedOut(true);
      }
    });
  }, []);

  return { authUser, isLoggedOut };
}
