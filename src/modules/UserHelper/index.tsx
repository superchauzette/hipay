import React, { useState, useEffect, createContext, useContext } from "react";
import firebase from "firebase";

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

export function useAuth() {
  const [authUser, setUser] = useState(undefined as userType | undefined);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        const photoURL = user.photoURL;
        const isAnonymous = user.isAnonymous;
        const providerData = user.providerData;
        const data: userType = {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          emailVerified: user.emailVerified,
          photoURL,
          isAnonymous,
          providerData
        };
        setUser(data);
      } else {
        setIsLogged(true);
      }
    });
  }, []);

  return { authUser, isLogged };
}
