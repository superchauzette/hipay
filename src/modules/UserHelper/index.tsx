import React, { useState, useEffect, createContext, useContext } from "react";
import { auth, db } from "../FirebaseHelper";

export type userType = {
  uid: string;
  displayName: string | null;
  email: string | null;
  emailVerified: boolean;
  photoURL: string | null;
  isAnonymous: boolean;
  providerData: (firebase.UserInfo | null)[];
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
    providerData
  };
}

export function useAuth() {
  const [authUser, setUser] = useState(undefined as userType | undefined);
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  useEffect(() => {
    auth().onAuthStateChanged(function(user) {
      if (user) {
        setIsLoggedOut(false);
        console.log("user", user.toJSON());
        // User is signed in.
        const data: userType = extractUser(user);
        setUser(data);
        db()
          .collection("users")
          .doc(data.uid)
          .set({ info: data }, { merge: true });
      } else {
        setIsLoggedOut(true);
      }
    });
  }, []);

  return { authUser, isLoggedOut };
}
