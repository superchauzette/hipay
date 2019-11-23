import * as express from "express";
import * as functions from "firebase-functions";
import * as bodyParser from "body-parser";
import * as OAuthClient from "intuit-oauth";
import * as admin from "firebase-admin";

import * as cors from "cors";
const db = admin.firestore();

const domain = "https://portail.hiway-freelance.com";
const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const getUser = async (userId: string) => {
  return await db
    .collection("users")
    .doc(userId)
    .get()
    .then(doc => doc.data());
};

const userMiddleWare = async (req: any, res: any, next: any) => {
  const { userId } = req.query;
  if (!userId) {
    res.redirect(`${domain}?error=nouser`);
  }
  const user = await db
    .collection("users")
    .doc(userId)
    .get()
    .then(doc => doc.data());
  if (user && user.quickbook) {
    res.user = user;
    next();
  } else {
    res.redirect(`${domain}?error=nouser`);
  }
};

const urlencodedParser = bodyParser.urlencoded({ extended: false });

const oauthClient = (clientId: string, clientSecret: string) =>
  new OAuthClient({
    clientId,
    clientSecret,
    environment: "production",
    redirectUri:
      "https://us-central1-hipay-42.cloudfunctions.net/quickbooksApi/callback"
  });

app.get("/authUri", urlencodedParser, userMiddleWare, async (req, res: any) => {
  console.log("res user", res.user);

  const user = res.user;
  if (user || user.quickbook) {
    const authUri = oauthClient(
      user.quickbook.clientId,
      user.quickbook.clientSecret
    ).authorizeUri({
      scope: [OAuthClient.scopes.Accounting],
      state: user.uid
    });
    console.log("authUri", "=>", authUri);
    res.redirect(authUri);
  } else {
    res.redirect(`${domain}?error=noquickbook`);
  }
});

app.get("/callback", async (req, res) => {
  console.log("req", req);
  console.log("req", req.query.state);
  console.log("req.url", req.url);
  const user = await getUser(req.query.state);
  console.log("callback user", user);
  if (!user || !user.quickbook) {
    console.error(
      `${user ? "No user in callback" : "users quickbook conf not present"}`
    );
    res.redirect(`${domain}?error=noquickbook`);
  } else {
    const instanceOauthClient = oauthClient(
      user.quickbook.clientId,
      user.quickbook.clientSecret
    );
    instanceOauthClient
      .createToken(req.url)
      .then((authResponse: any) => {
        const oauth2_token_json = authResponse.getJson();
        const companyID = instanceOauthClient.getToken().realmId;

        res.redirect(
          `${domain}?token=${oauth2_token_json.access_token}&refreshToken=${
            oauth2_token_json.refresh_token
          }&expireAt=${new Date().getTime() +
            parseInt(
              oauth2_token_json.expires_in
            )}&refreshExpireAt=${new Date().getTime() +
            parseInt(oauth2_token_json.x_refresh_token_expires_in)}
        &createdAt=${new Date().getTime()}&realmId=${companyID}`
        );
      })
      .catch((e: any) => {
        console.error(e);
        // res.status(500).send(e);
        res.redirect(`${domain}?error=true`);
      });
  }
});

app.get("/refreshAccessToken", userMiddleWare, (req, res: any) => {
  const { refreshAccessToken } = req.query;
  const user = res.user;
  oauthClient(user.quickbook.clientId, user.quickbook.clientSecret)
    .refreshUsingToken(refreshAccessToken)
    .then((authResponse: any) => {
      console.log(
        "The Refresh Token is  " + JSON.stringify(authResponse.getJson())
      );
      const oauth2_token_json = authResponse.getJson();
      console.log("oauth2_token_json", "=>", oauth2_token_json);
      res.send({
        token: oauth2_token_json.access_token,
        expireAt:
          new Date().getTime() + parseInt(oauth2_token_json.expires_in) * 1000,
        refreshToken: oauth2_token_json.refresh_token,
        refreshExpireAt:
          new Date().getTime() +
          parseInt(oauth2_token_json.x_refresh_token_expires_in) * 1000
      });
    })
    .catch((e: any) => {
      console.error(e);
      res.status(500).send(e);
    });
});

export const quickbooksApi = functions.https.onRequest(app);
