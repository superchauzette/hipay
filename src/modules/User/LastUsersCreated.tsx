import React, { useEffect, useState } from "react";
import { db, extractQueries } from "../FirebaseHelper";
import {
  Table,
  Grid,
  TableRow,
  TableBody,
  TableCell,
  TableHead
} from "@material-ui/core";

export function LastUsersCreated() {
  const [users, setUsers] = useState<any[] | null>(null);
  useEffect(() => {
    const unsubscribe = db()
      .collection("users")
      .orderBy("metadata.creationTime", "desc")
      .onSnapshot(doc => {
        setUsers(extractQueries(doc));
      });

    return () => unsubscribe();
  }, []);

  return (
    <Grid spacing={4} container>
      {users && Boolean(users.length) && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Créé le</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(u => (
              <TableRow key={u.uid}>
                <TableCell>{u.displayName}</TableCell>
                <TableCell>
                  {u.createdAt && u.createdAt.toDate().toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Grid>
  );
}
