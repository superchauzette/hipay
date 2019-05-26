import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

export async function setAdminUser(email: string, isAdmin: boolean) {
  try {
    const user = await admin.auth().getUserByEmail(email);
    console.log("user", user, email);
    return admin.auth().setCustomUserClaims(user.uid, { admin: isAdmin });
  } catch (err) {
    console.error(err);
  }
}

setAdminUser("kevin.tillot@gmail.com", true);

export const setAdminClaims = functions.firestore
  .document("admin/{adminId}")
  .onCreate((snap: any, context: any) => {
    const data = snap.data(); // context.params.email
    console.log("email", data);
    return setAdminUser(data.email, true);
  });

export const deleteAdminClaims = functions.firestore
  .document("admin/{adminId}")
  .onDelete((snap: any, context: any) => {
    const data = snap.data(); // context.params.email
    console.log("email", data.email);
    return setAdminUser(data.email, false);
  });
