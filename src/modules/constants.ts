const CLIENTID = "L0begC9hX3ZLc518PZcr4vP2wFSPl1dDbAYvi3tpsqO1oKAcC7";
const CLIENTSECRET = "9Lb0xc1J4oUCRb29w4arGoclqYFXFrXd9gYUlXxe";
export const QUICKBOOK_AUTH = `https://us-central1-hipay-42.cloudfunctions.net/quickbooksApi/authUri`;
export const QUICKBOOK_COMPANY = (token, realmId) =>
  `https://hiwayapi-demo.herokuapp.com/index.php/oauth2access?state=GIDGE&code=${token}&realmId=${realmId}&quickbooks_client_id=${CLIENTID}&quickbooks_client_secret=${CLIENTSECRET}`;

export const months = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre"
];
