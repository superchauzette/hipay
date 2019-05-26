import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

export async function setAdminUser(email: string, isAdmin: boolean) {
  try {
    const user = await admin.auth().getUserByEmail(email);
    if (user.emailVerified) {
      return admin.auth().setCustomUserClaims(user.uid, { admin: isAdmin });
    }
  } catch (err) {
    console.error(err);
  }
}

export const setAdminClaims = functions.firestore
  .document("admin/{email}")
  .onCreate((snap: any, context: any) => {
    const email = snap.data(); // context.params.email
    return setAdminUser(email, true);
  });

export const deleteAdminClaims = functions.firestore
  .document("admin/{email}")
  .onDelete((snap: any, context: any) => {
    const email = snap.data(); // context.params.email
    return setAdminUser(email, false);
  });
