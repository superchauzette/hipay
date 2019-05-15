import { httpAuthHipay } from "./fetchAuth";
import { userApi } from "./userApi";
import { ikApi } from "./ikApi";

export function HipayApi() {
  return Object.freeze({
    ik: ikApi(httpAuthHipay),
    user: userApi(httpAuthHipay)
  });
}
