import React, { useState, useEffect } from "react";
import { Flex } from "rebass";
import { MonthSelector, useDateChange } from "../CommonUi/MonthSelector";
import { List, ListItem, Divider, CircularProgress } from "@material-ui/core";
import { Card, Header, BtnAdd, PageWrapper } from "../CommonUi";
import { useUserContext } from "../UserHelper";
import { FormCharge } from "./FormCharge";
import { chargesCol, storageRef, userCol } from "../FirebaseHelper";
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

  const [mySociete, setMySociete] = useState("");
  useEffect(() => {
    const saveSociete = localStorage.getItem("MySociete");
    if (saveSociete) setMySociete(saveSociete);
  }, []);

  function handleSociete(e) {
    setMySociete(e.target.value);
    localStorage.setItem("MySociete", e.target.value);
    if (user)
      userCol()
        .doc(user.uid)
        .update({ mySociete: e.target.value });
  }

  return (
    <PageWrapper>
      <Header title="Charges" />
      <MonthSelector onChange={handleChangeMonth} />

      <Card width={1}>
        <List>
          <Flex px={3} pt={3} pb={1}>
            <input
              type="text"
              placeholder="Nom de ma Société"
              style={{
                border: "none",
                borderBottom: "1px solid #80808063",
                outline: "none",
                backgroundColor: "transparent",
                fontSize: "18px",
                fontWeight: "bold",
                width: "300px",
                maxWidth: "100%"
              }}
              value={mySociete}
              onChange={handleSociete}
            />
          </Flex>
          {isLoading && (
            <Flex width={1} justifyContent="center">
              <CircularProgress />
            </Flex>
          )}
          {!isLoading &&
            charges.map((charge, index) => (
              <div key={charge.id}>
                <ListItem>
                  <FormCharge
                    charge={charge}
                    onChange={n => handleChange(charge.id, n)}
                    onDelete={removeCharge}
                    onUpdateFile={updateFile}
                  />
                </ListItem>
                {charges.length - 1 !== index && <Divider />}
              </div>
            ))}
        </List>
      </Card>
      <BtnAdd onClick={addCharge} />
    </PageWrapper>
  );
}
