import React from "react";
import ReactDOM from "react-dom";
import * as firebase from "firebase";
import "./index.css";
import { App } from "./modules/App/App";
import * as serviceWorker from "./serviceWorker";

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

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
