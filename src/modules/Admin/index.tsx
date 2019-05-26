import React, { useEffect, useState } from "react";
import { Flex, Text } from "rebass";
import {
  PageWrapper,
  MonthSelector,
  Header,
  useDateChange,
  Avatar
} from "../CommonUi";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { getResources, getUsers } from "./getResources";

function Detail({ title, data, render }) {
  return (
    <Flex flexDirection="column" width={[1, 1 / 2]} mt={2}>
      <Text fontWeight="bold">{title}</Text>
      {data && data.map(render)}
    </Flex>
  );
}

function Details({ user, cras, ndfs, iks, charges }) {
  return (
    <ExpansionPanel>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
      >
        <Flex alignItems="center">
          <Avatar src={user.info.photoURL} />
          <Text ml={2}>{user.info.displayName}</Text>
        </Flex>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Flex flexWrap="wrap" width={1}>
          <Detail
            title="CRA"
            data={cras}
            render={cra => (
              <Text>{`a travaillé chez ${cra.client} ${cra.total} jours`}</Text>
            )}
          />
          <Detail
            title="Note de Frais"
            data={ndfs}
            render={ndf => (
              <Text>{`${ndf.dateAchat} ${ndf.type} ${ndf.montant}€`}</Text>
            )}
          />

          <Detail
            title="Indeminté Kilométriques"
            data={iks}
            render={ik => (
              <Text>{`${ik.dateIk} - ${ik.kmParcourus}km ${ik.montant}€`}</Text>
            )}
          />
          <Detail
            title="Charges"
            data={charges}
            render={charge => (
              <Text>{`${charge.description} - ${charge.file &&
                charge.file.name}`}</Text>
            )}
          />
        </Flex>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

export function Admin() {
  const { month, year, handleChangeMonth } = useDateChange();
  const [users, setUsers] = useState([] as any[]);
  const [crasByUser, setCraByUser] = useState({} as any);
  const [ndfByUser, setNdfByUser] = useState({} as any);
  const [ikByUser, setIkByUser] = useState({} as any);
  const [chargesByUser, setChargesByUser] = useState({} as any);

  useEffect(() => {
    const getByName = getResources({ month, year });
    getByName("cra").then(setCraByUser);
    getByName("ndf").then(setNdfByUser);
    getByName("ik").then(setIkByUser);
    getByName("charges").then(setChargesByUser);
  }, [month, year]);

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  return (
    <PageWrapper>
      <Header title="Admin" />
      <MonthSelector onChange={handleChangeMonth} />
      <Flex flexDirection="column" mt={2} width={1}>
        {users.map(user => (
          <Details
            user={user}
            cras={crasByUser[user.id]}
            ndfs={ndfByUser[user.id]}
            iks={ikByUser[user.id]}
            charges={chargesByUser[user.id]}
          />
        ))}
      </Flex>
    </PageWrapper>
  );
}
