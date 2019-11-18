import React, { useEffect, useState } from "react";
import { db, extractQueries } from "../FirebaseHelper";
import { firestore } from "firebase";
import {
  Typography,
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
      .orderBy("info.metadata.creationTime", "desc")
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
              <TableRow key={u.info.uid}>
                <TableCell>{u.info.displayName}</TableCell>
                <TableCell>
                  {u.info.createdAt &&
                    u.info.createdAt.toDate().toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Grid>
  );
}
