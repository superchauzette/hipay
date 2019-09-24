import React, { useEffect, useState } from "react";
import { Box, Flex, Text } from "rebass";
import {
  PageWrapper,
  MonthSelector,
  Header,
  useDateChange,
  Avatar,
  LinkPdf,
  DownloadLink
} from "../CommonUi";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  CircularProgress,
  Button,
  ExpansionPanelActions
} from "@material-ui/core";
import { Restaurant, DirectionsCar } from "@material-ui/icons";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { getResources, getUsers } from "./getResources";
import { DocumentCRA } from "../CRA/pdf";
import { DocumentNDF } from "../NDF/pdf";
import { getTotal } from "../hooks/useTotal";
import { DocumentIk } from "../IK/pdf";
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Build as BuildIcon
} from "@material-ui/icons";
import { IconText } from "../App/App";
import { Link } from "react-router-dom";

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

function hasNdk(ndfs) {
  return ndfs ? ndfs.length > 0 : false;
}

function hasIks(iks) {
  return iks ? iks.length > 0 : false;
}

function Details({ user, cras, ndfs, iks, charges }) {
  return (
    <ExpansionPanel>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
      >
        <Flex alignItems="center" justifyContent="space-between" width="100%">
          <Flex alignItems="center">
            <Avatar src={user.info.photoURL} />
            <Text ml={2}>{user.info.displayName}</Text>
          </Flex>
          <Flex alignItems="center">
            {hasNdk(ndfs) && (
              <IconText color="blue" icon={<Restaurant />} text="NDF" mr={1} />
            )}
            {hasIks(iks) && (
              <IconText
                color="blue"
                icon={<DirectionsCar />}
                text="IK"
                mr={1}
              />
            )}
            <Text>
              {cras &&
                cras
                  .map(cra => (cra.isSaved ? `${cra.total}j` : ""))
                  .join(", ")}
            </Text>
          </Flex>
        </Flex>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Flex flexWrap="wrap" width={1}>
          <Detail
            key={user.id + "CRA"}
            title="CRA"
            data={cras}
            render={cra => (
              <Flex key={cra.id}>
                <Box mr={2}>
                  {cra.isSaved ? (
                    <CheckIcon style={{ fill: "green" }} />
                  ) : (
                    <CloseIcon style={{ fill: "red" }} />
                  )}
                </Box>
                <LinkPdf
                  title={`a travaillé chez ${cra.client} ${cra.total} jours`}
                  fileName={`cra-${user.info.displayName}-${cra.month}-${cra.year}.pdf`}
                  document={<DocumentCRA cra={cra} user={user} />}
                />
              </Flex>
            )}
          />
          <Detail
            key={user.id + "ndf"}
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
              <Flex key={ndf.id} justifyContent="space-between">
                <Text>{ndf.dateAchat} </Text>
                <Text>{ndf.type} </Text>
                <Text>{ndf.montant} €</Text>
              </Flex>
            )}
          />

          <Detail
            key={user.id + "ik"}
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
              <Flex key={ik.id} justifyContent="space-between" pr={[0, 2]}>
                <Text>{ik.dateIk}</Text>
                <Text>{ik.kmParcourus}</Text>
                <Text>{ik.montant} €</Text>
              </Flex>
            )}
          />
          <Detail
            key={user.id + "Charges"}
            title="Charges"
            data={charges}
            render={charge => (
              <Flex key={charge.id} justifyContent="space-between">
                <Text>{charge.description}</Text>
                {charge.file && (
                  <DownloadLink
                    type="charges"
                    month={charge.month}
                    year={charge.year}
                    fileName={charge.file.name}
                  />
                )}
              </Flex>
            )}
          />
        </Flex>
      </ExpansionPanelDetails>
      <ExpansionPanelActions>
        <Link to={`user/${user.id}`}>
          <Button>
            <BuildIcon />
          </Button>
        </Link>
      </ExpansionPanelActions>
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
        {users && !users.length && (
          <Flex justifyContent="center" width={1}>
            <CircularProgress />
          </Flex>
        )}
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
