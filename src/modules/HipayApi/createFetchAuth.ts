export type fetchAuthType = (
  path: string,
  option?: RequestInit
) => Promise<any>;

type paramsCreateFetchAuthType = {
  host: string;
  token?: string;
  whenTokenIsExpired?: (res?: Response) => boolean;
  getToken?: (o?: any) => Promise<string>;
};

export function createFetchAuth({
  host,
  token,
  whenTokenIsExpired = () => false,
  getToken = async () => ""
}: paramsCreateFetchAuthType): fetchAuthType {
  let countRefreshToken = 0;
  let tokenSave = token;

  if (!tokenSave) {
    getToken().then(t => {
      tokenSave = t;
    });
  }

  return function fetchAuth(
    path: string,
    option?: RequestInit
  ): Promise<Response> {
    const url = host + path;
    const authOption = {
      ...option,
      credentials: "same-origin" as "same-origin",
      headers: {
        Authorization: `Bearer ${tokenSave}`,
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(option && option.headers)
      }
    };
    return fetch(url, authOption).then(async res => {
      const isTokenExpired = whenTokenIsExpired(res);
      console.log({ isTokenExpired });
      if (isTokenExpired) {
        const newToken = await getToken();
        tokenSave = newToken;
        countRefreshToken += 1;
        if (countRefreshToken > 5) {
          throw new Error("Too many refresh Token");
        }
        return fetchAuth(path, option);
      }

      const isGoodStatus = res.status >= 200 && res.status < 300;
      if (!isGoodStatus) {
        const err = await res.json();
        throw err.error || err;
      }

      return res.json();
    });
  };
}

export type httpAuth = (
  params: paramsCreateFetchAuthType
) => {
  get: (url: string) => Promise<Response>;
  post: (url: string, body: any) => Promise<Response>;
  put: (url: string, body: any) => Promise<Response>;
  patch: (url: string, body: any) => Promise<Response>;
  delete: (url: string) => Promise<Response>;
};

export const toHttpCaller = (fetchCaller: fetchAuthType) => ({
  get: (url: string, option?: RequestInit) => fetchCaller(url, option),

  post: (url: string, body: any, option?: RequestInit) =>
    fetchCaller(url, { ...option, method: "POST", body: JSON.stringify(body) }),

  put: (url: string, body: any, option?: RequestInit) =>
    fetchCaller(url, { ...option, method: "PUT", body: JSON.stringify(body) }),

  patch: (url: string, body: any, option?: RequestInit) =>
    fetchCaller(url, {
      ...option,
      method: "PATCH",
      body: JSON.stringify(body)
    }),

  delete: (url: string, option?: RequestInit) =>
    fetchCaller(url, { ...option, method: "DELETE" })
});

export const createHttpAuth = (params: paramsCreateFetchAuthType) =>
  toHttpCaller(createFetchAuth(params));
