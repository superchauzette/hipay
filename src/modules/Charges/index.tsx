import React from "react";
import { Flex } from "rebass";
import { MonthSelector, useDateChange } from "../CommonUi/MonthSelector";
import { List, ListItem, Divider, CircularProgress } from "@material-ui/core";
import { Card, Header, BtnAdd, PageWrapper } from "../CommonUi";
import { useUserContext } from "../UserHelper";
import { FormCharge } from "./FormCharge";
import { chargesCol, storageRef } from "../FirebaseHelper";
import { ChargeType } from "./types";
import { useCRUD } from "../hooks";

export function Charges() {
  const user = useUserContext();
  const { month, year, handleChangeMonth } = useDateChange();
  const deps = { collection: chargesCol, storageRefPath: storageRef().charges };
  const {
    data: charges,
    isLoading,
    addData: addCharge,
    removeData: removeCharge,
    handleChange,
    updateFile
  } = useCRUD<ChargeType>({ user, month, year }, deps);

  return (
    <PageWrapper>
      <Header title="Charges" />
      <MonthSelector onChange={handleChangeMonth} />

      <Card width={1}>
        <List>
          {isLoading && (
            <Flex width={1} justifyContent="center">
              <CircularProgress />
            </Flex>
          )}
          {charges.map(charge => (
            <>
              <ListItem key={charge.id}>
                <FormCharge
                  charge={charge}
                  onChange={n => handleChange(charge.id, n)}
                  onDelete={addCharge}
                  onUpdateFile={updateFile}
                />
              </ListItem>
              <Divider />
            </>
          ))}
        </List>
      </Card>
      <BtnAdd onClick={removeCharge} />
    </PageWrapper>
  );
}
