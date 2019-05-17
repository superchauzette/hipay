import * as firebase from "firebase";

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
