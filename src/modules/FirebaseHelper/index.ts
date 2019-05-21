import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";

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
}

export const db = () => firebase.firestore();

export const storage = () => firebase.storage();

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
