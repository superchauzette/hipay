import { useState, useEffect } from "react";
import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";
import { useUserContext } from "../UserHelper";

type AppCollection = {
  user: {
    uid: string;
  };
  year: number;
  month: number;
};

export function initFirebase() {
  const firebaseConfig = {
    apiKey: "AIzaSyDGt9y_yhWZOomFemdI4cNj_AifW_CLXnc",
    authDomain: "hipay-42.firebaseapp.com",
    databaseURL: "https://hipay-42.firebaseio.com",
    projectId: "hipay-42",
    storageBucket: "hipay-42.appspot.com",
    messagingSenderId: "923321891171",
    appId: "1:923321891171:web:9b2b49003063806f"
  };

  firebase.initializeApp(firebaseConfig);
  firebase.firestore().enablePersistence();
}

export const auth = () => firebase.auth();
export const db = () => firebase.firestore();
export const storage = () => firebase.storage();

export function useIsAdmin(): boolean {
  const user = useUserContext();
  const [isAdmin, setAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      db()
        .collection("admin")
        .where("email", "==", user.email)
        .get()
        .then(extractQueries)
        .then(tab => tab[0])
        .then(adminDoc => {
          console.log("adminDoc", adminDoc);
          return setAdmin(adminDoc ? Boolean(adminDoc.id) : false);
        });
    }
  }, [user]);

  return isAdmin;
}

export async function googleAuth() {
  const provider = new firebase.auth.GoogleAuthProvider();
  await firebase.auth().signInWithRedirect(provider);
  const result = await firebase.auth().getRedirectResult();
  return result;
}

export const userCol = () => db().collection("users");
export const craCol = () => db().collection("cra");
export const ndfCol = () => db().collection("ndf");
export const ikCol = () => db().collection("ik");
export const chargesCol = () => db().collection("charges");
export const quickbookConfigCol = () => db().collection("quickbookConfig");

const store = (type: string) => ({ user, year, month }: AppCollection) => (
  filename: string
) => storage().ref(`users/${user.uid}/${year}/${month}/${type}/${filename}`);

export function storageRef() {
  return Object.freeze({
    cra: store("cra"),
    ndf: store("ndf"),
    ik: store("ik"),
    charges: store("charges")
  });
}

export function extractQueries(queries) {
  const data = [] as any[];
  queries.forEach(doc => {
    data.push(extractQuery(doc));
  });
  return data;
}

export function extractQuery(doc) {
  return { id: doc.id, ...doc.data() };
}
