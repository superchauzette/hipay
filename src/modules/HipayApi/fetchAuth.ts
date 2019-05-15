import { createHttpAuth } from "./createFetchAuth";

function getLocalStorageToken() {
  try {
    const { authentication } = JSON.parse(
      localStorage.getItem("authentication") || "{ authentication: {} }"
    );
    return authentication.id;
  } catch {
    return undefined;
  }
}

function whenTokenIsExpired(res?: Response) {
  if (!res) return false;
  return res.redirected && res.status === 401;
}

async function getToken(email = "test@test.com", password = "test") {
  const res = await fetch(
    "https://hiwayapi-demo.herokuapp.com/index.php/login_check",
    {
      method: "POST",
      body: JSON.stringify({ email, password })
    }
  );
  const token = await res.json();
  return token;
}

export const httpAuthHipay = createHttpAuth({
  host: "https://hiwayapi-demo.herokuapp.com/index.php/login_check",
  token: getLocalStorageToken(),
  whenTokenIsExpired,
  getToken
});
