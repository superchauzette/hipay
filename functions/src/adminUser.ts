import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export function setAdminUser(email: string, isAdmin: boolean) {
  admin
    .auth()
    .getUserByEmail(email)
    .then(user => {
      if (user.emailVerified) {
        return admin.auth().setCustomUserClaims(user.uid, { admin: isAdmin });
      }
    })
    .catch((err: any) => console.log(err));
}

export const setAdminClaims = functions.firestore
  .document("admin/{email}")
  .onCreate((snap: any, context: any) => {
    const email = snap.data(); // context.params.email
    setAdminUser(email, true);
  });

export const deleteAdminClaims = functions.firestore
  .document("admin/{email}")
  .onDelete((snap: any, context: any) => {
    const email = snap.data(); // context.params.email
    setAdminUser(email, false);
  });
