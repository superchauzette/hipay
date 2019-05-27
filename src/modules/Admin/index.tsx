import React, { useEffect, useState } from "react";
import { Flex, Text } from "rebass";
import {
  PageWrapper,
  MonthSelector,
  Header,
  useDateChange,
  Avatar,
  LinkPdf
} from "../CommonUi";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { getResources, getUsers } from "./getResources";
import { DocumentCRA } from "../CRA/pdf";
import { DocumentNDF } from "../NDF/pdf";
import { getTotal } from "../hooks/useTotal";
import { DocumentIk } from "../IK/pdf";

function Title({ title, data, fileName, document }) {
  return (
    <Flex>
      {data && data.length > 0 && (
        <LinkPdf title={title} fileName={fileName} document={document} />
      )}
    </Flex>
  );
}

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
              <LinkPdf
                title={`a travaillé chez ${cra.client} ${cra.total} jours`}
                fileName={`cra-${user.info.displayName}-${cra.month}-${
                  cra.year
                }.pdf`}
                document={<DocumentCRA cra={cra} user={user} />}
              />
            )}
          />
          <Detail
            title={
              <Title
                title="Note de Frais"
                data={ndfs}
                fileName={`ndf-${user.info.displayName}.pdf`}
                document={
                  <DocumentNDF
                    notes={ndfs}
                    total={getTotal(ndfs, (note: any) => note.montant || 0)}
                    user={user}
                  />
                }
              />
            }
            data={ndfs}
            render={ndf => (
              <Flex justifyContent="space-between">
                <Text>{ndf.dateAchat} </Text>
                <Text>{ndf.type} </Text>
                <Text>{ndf.montant} €</Text>
              </Flex>
            )}
          />

          <Detail
            title={
              <Title
                title="Indeminté Kilométriques"
                data={iks}
                fileName={`iks-${user.info.displayName}.pdf`}
                document={
                  <DocumentIk
                    iks={iks}
                    total={getTotal(iks, (ik: any) => ik.montant || 0)}
                    user={user}
                  />
                }
              />
            }
            data={iks}
            render={ik => (
              <Flex justifyContent="space-between" pr={[0, 2]}>
                <Text>{ik.dateIk}</Text>
                <Text>{ik.kmParcourus}</Text>
                <Text>{ik.montant} €</Text>
              </Flex>
            )}
          />
          <Detail
            title="Charges"
            data={charges}
            render={charge => (
              <Flex justifyContent="space-between">
                <Text>{charge.description}</Text>
                <Text>{charge.file && charge.file.name}</Text>
              </Flex>
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
            key={user.id}
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
