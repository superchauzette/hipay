export function ikApi(http: any) {
  return {
    getIks: () => http.get("/api/iks")
  };
}
