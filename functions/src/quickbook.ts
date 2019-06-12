import * as express from "express";
import fetch from "node-fetch";
import * as functions from "firebase-functions";
import * as bodyParser from "body-parser";
import * as OAuthClient from "intuit-oauth";
import * as cors from "cors";

const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const urlencodedParser = bodyParser.urlencoded({ extended: false });

const oauthClient = () =>
  new OAuthClient({
    clientId: "L0begC9hX3ZLc518PZcr4vP2wFSPl1dDbAYvi3tpsqO1oKAcC7",
    clientSecret: "9Lb0xc1J4oUCRb29w4arGoclqYFXFrXd9gYUlXxe",
    redirectUri:
      "https://us-central1-hipay-42.cloudfunctions.net/quickbooksApi/callback"
  });

app.get("/authUri", urlencodedParser, (_req, res) => {
  const authUri = oauthClient().authorizeUri({
    scope: [OAuthClient.scopes.Accounting],
    state: "OHHFA"
  });
  console.log("authUri", "=>", authUri);
  res.redirect(authUri);
});

app.get("/company", async (req, res) => {
  const token = req.headers.authorization;
  console.log(token);
  const response = await fetch(
    "https://sandbox-quickbooks.api.intuit.com/v3/company/123146386786444/",
    { headers: { Authorization: `${token}` } }
  );
  const json = await response.text();
  console.log(json);
  res.send(json);
});

app.get("/callback", (req, res) => {
  console.log(req.params);
  console.log(req.url);
  console.log(req.query);
  const instanceOauthClient = oauthClient();
  instanceOauthClient
    .createToken(req.url)
    .then((authResponse: any) => {
      console.log("authResponse", authResponse);
      const access_token = authResponse.access_token;
      console.log("access_token", "=>", access_token);
      const oauth2_token_json = authResponse.getJson();
      console.log("oauth2_token_json", "=>", oauth2_token_json);
      const companyID = instanceOauthClient.getToken().realmId;

      res.redirect(
        `https://hipay-42.firebaseapp.com?token=${
          oauth2_token_json.access_token
        }&refreshToken=${
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
      res.status(500).send(e);
    });
});

app.get("/refreshAccessToken", (req, res) => {
  const { refreshAccessToken } = req.query;
  oauthClient()
    .refreshUsingToken(refreshAccessToken)
    .then((authResponse: any) => {
      console.log(
        "The Refresh Token is  " + JSON.stringify(authResponse.getJson())
      );
      const oauth2_token_json = JSON.stringify(authResponse.getJson(), null, 2);
      console.log("oauth2_token_json", "=>", oauth2_token_json);
      res.send(oauth2_token_json);
    })
    .catch((e: any) => {
      console.error(e);
      res.status(500).send(e);
    });
});

app.get("/getCompanyInfo", (req, res) => {
  const companyID = oauthClient().getToken().realmId;
  console.log("companyID", "=>", companyID);
  oauthClient()
    .makeApiCall({
      url: `${
        functions.config().qbconfig.apiuri
      }${companyID}/companyinfo/${companyID}`
    })
    .then((apiResponse: any) => {
      console.log(
        "The response for API call is :" + JSON.stringify(apiResponse)
      );
      res.send(JSON.parse(apiResponse.text()));
    })
    .catch((e: any) => {
      console.error(e);
      res.status(500).send(e);
    });
});

app.get("/getCustomer", (req, res) => {
  const companyID = oauthClient().getToken().realmId;
  console.log("companyID", "=>", companyID);
  const id = req.query.id;
  console.log("/getCustomer", "=>", id);
  if (id) {
    oauthClient()
      .makeApiCall({
        url: `${functions.config().qbconfig.apiuri}${companyID}/customer/${id}`
      })
      .then((apiResponse: any) => {
        console.log(
          "The response for API call is :" + JSON.stringify(apiResponse)
        );
        res.send(JSON.parse(apiResponse.text()));
      })
      .catch((e: any) => {
        console.error(e);
        res.status(500).send(e);
      });
  } else {
    res.status(204).send({ message: "query string :id is required" });
  }
});

app.post("/createCustomer", (req, res) => {
  const companyID = oauthClient().getToken().realmId;
  console.log("companyID", "=>", companyID);
  const payload = req.body;
  console.log("/createCustomer", "=>", payload);
  // const options = {
  //   method: "POST",
  //   uri: `${functions.config().qbconfig.apiuri}${companyID}/customer`,
  //   body: payload,
  //   headers: {
  //     Authorization: `Bearer ${access_token}`
  //   }
  // };
});
export const quickbooksApi = functions.https.onRequest(app);
