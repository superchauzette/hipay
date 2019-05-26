import { db, extractQueries } from "../FirebaseHelper";
import groupBy from "lodash/fp/groupBy";
export const getResources = ({ month, year }) => ressourceName =>
  db()
    .collection(ressourceName)
    .where("year", "==", year)
    .where("month", "==", month)
    .get()
    .then(extractQueries)
    .then(groupBy("userid"));
export const getUsers = () =>
  db()
    .collection("users")
    .get()
    .then(extractQueries);
