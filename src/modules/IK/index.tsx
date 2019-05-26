import React, { useEffect } from "react";
import { Flex, Text } from "rebass";
import { MonthSelector, useDateChange } from "../CommonUi/MonthSelector";
import { Card, Header, PageWrapper } from "../CommonUi";
import { useUserContext } from "../UserHelper";
import { FormIK } from "./FormIK";
import { storageRef, ikCol, isAdmin } from "../FirebaseHelper";
import { ikType } from "./types";
import { BtnAdd } from "../CommonUi/BtnAdd";
import { Divider, CircularProgress, List, ListItem } from "@material-ui/core";
import { useCRUD, useTotal } from "../hooks";

export function IK() {
  const user = useUserContext();
  const { month, year, handleChangeMonth } = useDateChange();
  const deps = { collection: ikCol, storageRefPath: storageRef().ik };
  const {
    data: iks,
    isLoading,
    addData: addIk,
    removeData: deleteIk,
    handleChange,
    updateFile
  } = useCRUD<ikType>({ user, month, year }, deps);
  const total = useTotal<ikType>(iks, ik => ik.montant || 0);

  return (
    <PageWrapper>
      <Header title="Indemnités Kilométriques" />
      <MonthSelector onChange={handleChangeMonth} />

      <Flex width={1} mb={3} justifyContent="flex-end">
        <Text>Total: {total}€</Text>
      </Flex>
      <Card width={1}>
        <List>
          {isLoading && (
            <Flex width={1} justifyContent="center">
              <CircularProgress />
            </Flex>
          )}
          {iks.map(ik => (
            <div key={ik.id}>
              <ListItem>
                <FormIK
                  ik={ik}
                  onChange={n => handleChange(ik.id, n)}
                  onDelete={deleteIk}
                  onUpdateFile={updateFile}
                />
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
      </Card>
      <Flex width={1} mt={3} />
      <BtnAdd onClick={addIk} />
    </PageWrapper>
  );
}
