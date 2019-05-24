import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";

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

const defaultAdmin = { getIdTokenResult: () => ({ claims: { admin: false } }) };

export async function isAdmin(): Promise<boolean> {
  try {
    const idToken = await (
      auth().currentUser || defaultAdmin
    ).getIdTokenResult();
    return idToken.claims.admin;
  } catch {
    return false;
  }
}

export async function googleAuth() {
  const provider = new firebase.auth.GoogleAuthProvider();
  await firebase.auth().signInWithRedirect(provider);
  const result = await firebase.auth().getRedirectResult();
  return result;
}

export const userCol = () => db().collection("users");
export const craCol = () => db().collection("cra");
export const ndkCol = () => db().collection("ndf");
export const ikCol = () => db().collection("ik");
export const chargesCol = () => db().collection("charges");

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
  const data = [] as string[];
  queries.forEach(doc => {
    data.push({ id: doc.id, ...doc.data() });
  });
  return data;
}

// TO DELETE
function appDataCollection({ user, year, month }: AppCollection) {
  return db()
    .collection("users")
    .doc(user.uid)
    .collection(String(year))
    .doc(String(month))
    .collection("appData");
}

const app = (docId: string) => (p: AppCollection) =>
  appDataCollection(p).doc(docId);

export function appDoc() {
  return Object.freeze({
    ndf: app("ndf"),
    cra: app("cra"),
    ik: app("ik"),
    charges: app("charges")
  });
}
