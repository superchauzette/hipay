import React, { useState, useEffect } from "react";
import { Flex, Box, Text } from "rebass";
import { craCollection } from "./service";
import { userType } from "../UserHelper";
import {
  Card,
  MyBox,
  BtnDelete,
  LinkPdf,
  DownloadLink,
  MyInput
} from "../CommonUi";
import { DayofWeekMobile } from "./DayofWeekMobile";
import { UploadCRA } from "./UploadCRA";
import { CalandarType } from "./types";
import { WhiteSpace } from "./WhiteSpace";
import { Button } from "@material-ui/core";
import { DocumentCRA } from "./pdf";
import { storageRef } from "../FirebaseHelper";
import { Dot } from "./Dot";

type CRAProps = {
  cra: any;
  month: number;
  year: number;
  user: userType;
  showTrash?: boolean;
};

export const tabDays = ["lu", "ma", "me", "je", "ve", "sa", "di"];

export function getTotal(calendar: CalandarType[]): number {
  if (!calendar || !calendar.length) return 0;

  const total = calendar
    .map(c => c.cra || 0)
    .reduce((a, b) => Number(a) + Number(b), 0);

  return Number(total);
}

function getDotType(value: string) {
  return {
    "1": "circle",
    "0.5": "demi-circle",
    "0": "none"
  }[value];
}

export function FormCra({ cra, showTrash, month, year, user }: CRAProps) {
  const [calendar, setCalendar] = useState([] as CalandarType[]);
  const [isSaved, setIsSaved] = useState(false);
  const [client, setClient] = useState("");
  const [commentaire, setCommentaire] = useState("");
  const [file, setFile] = useState();
  const total = getTotal(calendar);
  const id = cra.id;

  useEffect(() => {
    (async function init() {
      setCalendar(cra.calendar);
      setIsSaved(cra.isSaved);
      setClient(cra.client || localStorage.getItem("client"));
      setFile(cra.file);
      setCommentaire(cra.commentaire);
    })();
  }, [cra, month, year]);

  function save(mid, value) {
    craCollection().save(mid, {
      ...value,
      client,
      userid: cra.userid,
      month,
      year
    });
  }

  function fillAll() {
    const calendarToSave = calendar.map(c =>
      !c.isWeekend && !c.isJourFerie ? { ...c, cra: 1 } : c
    );
    setCalendar(calendarToSave);
    save(id, { calendar: calendarToSave });
  }

  async function updateCRA(nbOfday: number) {
    function calcul(c) {
      if (c.cra === 0) return 0.5;
      if (c.cra === 0.5) return 1;
      if (c.cra === 1) return 0;
      return 0.5;
    }

    const calendarToSave = calendar.map(c =>
      c.nbOfday === nbOfday
        ? {
            ...c,
            cra: calcul(c)
          }
        : c
    );
    setCalendar(calendarToSave);
    save(id, { calendar: calendarToSave });
  }

  async function saveCRA() {
    setIsSaved(save => !save);
    save(id, { isSaved: !isSaved });
  }

  function saveFileInfo(fileUploaded) {
    setFile(fileUploaded);
    storageRef()
      .cra({ user, month, year })(fileUploaded.name)
      .put(fileUploaded);
    save(id, {
      file: {
        name: fileUploaded.name,
        size: fileUploaded.size,
        type: fileUploaded.type
      }
    });
  }

  function saveClient(e) {
    const value = e.target.value;
    setClient(value);
    localStorage.setItem(`client`, value);
    save(id, { client: value });
  }

  function saveCommentaire(e) {
    const value = e.target.value;
    setCommentaire(value);
    save(id, { commentaire: value });
  }

  async function deleteCRAUpload() {
    save(id, { file: {} });
    storageRef()
      .cra({ user, month, year })(file.name)
      .delete();
    setFile({});
  }

  async function deleteCRA() {
    craCollection().remove(id);
  }

  function handleDotClick(c: CalandarType) {
    if (!c.isWeekend && !c.isJourFerie && !isSaved) {
      updateCRA(c.nbOfday);
    }
  }

  return (
    <Flex flexDirection="column" width={1}>
      <UploadCRA
        mkey={`${id}-${month}-${year}` || "0"}
        link={
          file &&
          file.name && (
            <DownloadLink
              mt={2}
              type="cra"
              month={month}
              year={year}
              fileName={file.name}
            />
          )
        }
        file={file}
        onFile={saveFileInfo}
        onDelete={deleteCRAUpload}
      />
      <Text textAlign="center" fontWeight="bold">
        ou
      </Text>
      <Card width={1} p={3}>
        <Flex flexDirection="column">
          <Flex mt={3}>
            <MyInput
              type="text"
              placeholder="Nom du client"
              value={client || ""}
              onChange={saveClient}
              disabled={isSaved}
            />

            <Box m="auto" />
            {showTrash && <BtnDelete onClick={deleteCRA} />}
          </Flex>

          <Flex mt={3} alignItems="center">
            {!isSaved && (
              <Button variant="outlined" onClick={fillAll}>
                Fill All
              </Button>
            )}
            <Box m="auto" />
            <Flex alignItems="center">
              <Text mx={1}>Total jours travaillés :</Text>
              <Text fontWeight={"bold"} fontSize={3}>
                {total} jours
              </Text>
            </Flex>
          </Flex>
          <Flex mt={3} alignItems="center">
            <Text style={{ fontStyle: "italic" }} fontSize={"11px"}>
              Cocher Fill all si vous avez travaillé tous les jours ouvrés du
              mois Saisir 1 pour 1 journée complète et 0,5 pour une demi-journée
            </Text>
          </Flex>

          <Box width="100%" mt={2}>
            <Flex
              justifyContent={["flex-start", "flex-start", "space-between"]}
              flexWrap={["wrap", "wrap", "wrap"]}
            >
              <DayofWeekMobile tabDays={tabDays} />
              <WhiteSpace calendar={calendar} tabDays={tabDays} />
              {calendar.map(c => (
                <Box
                  key={`${id}-${month}-${year}-${c.nbOfday}`}
                  width={[1 / 7, "40px", "40px"]}
                  color={c.isWeekend || c.isJourFerie ? "grey" : "black"}
                >
                  <MyBox display={["none", "block"]}>
                    <Text textAlign="center">{c.dayOfWeek}</Text>
                  </MyBox>
                  <Dot
                    type={getDotType(String(c.cra))}
                    disabled={isSaved}
                    onClick={() => handleDotClick(c)}
                  >
                    {c.nbOfday}
                  </Dot>
                </Box>
              ))}
            </Flex>
          </Box>
          <Flex width={[1, "40%"]} mt={1}>
            <textarea
              placeholder="Commentaire, astreintes"
              style={{
                width: "100%",
                height: "50px",
                padding: "5px",
                borderRadius: "10px",
                marginTop: "8px"
              }}
              value={commentaire || ""}
              onChange={saveCommentaire}
              disabled={isSaved}
            />
          </Flex>
          <Flex alignItems="center" mt={2} flexWrap="wrap">
            <Flex mb={2} alignItems="center">
              <Button
                variant="contained"
                color="primary"
                onClick={saveCRA}
                disabled={!Boolean(client)}
              >
                {isSaved ? "Modifier" : "Valider"}
              </Button>
              {!isSaved && (
                <Text ml={3} style={{ fontStyle: "italic" }} fontSize={"10px"}>
                  Pensez à renseigner votre client
                </Text>
              )}
              {isSaved && <Text ml={3}>Votre CRA est validé</Text>}
            </Flex>
            <Box mx="auto" />
            {cra && user && (
              <LinkPdf
                disabled={!isSaved}
                label="imprimer"
                fileName={`cra-${client}-${month}-${year}.pdf`}
                document={
                  <DocumentCRA
                    user={user}
                    cra={{
                      calendar,
                      client,
                      commentaire,
                      file,
                      total,
                      month,
                      year
                    }}
                  />
                }
              />
            )}
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
}
