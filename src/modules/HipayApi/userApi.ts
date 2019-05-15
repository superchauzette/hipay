export function userApi(http: any) {
  return {
    getUsers: () => http.get(`/api/users`)
  };
}
