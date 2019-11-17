// import * as functions from "firebase-functions";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

import * as admin from "firebase-admin";

admin.initializeApp();
export { quickbooksApi } from "./quickbook";
export { users } from "./user";
export { setAdminClaims, deleteAdminClaims } from "./adminUser";
