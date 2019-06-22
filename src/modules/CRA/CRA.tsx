import React, { useState, useEffect } from "react";
import { Flex, Box, Text } from "rebass";
import { craCollection } from "./service";
import { userType } from "../UserHelper";
import { Card, MyBox, BtnDelete, LinkPdf, DownloadLink } from "../CommonUi";
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
  date: Date;
  month: number;
  year: number;
  user: userType;
  showTrash?: boolean;
  onDelete: () => void;
};

export const tabDays = ["lu", "ma", "me", "je", "ve", "sa", "di"];

function getTotal(calendar: CalandarType[]): number {
  if (!calendar || !calendar.length) return 0;

  const total = calendar
    .map(c => c.cra || 0)
    .reduce((a, b) => Number(a) + Number(b), 0);

  return Number(total);
}

export function CRA({
  cra,
  showTrash,
  date,
  month,
  year,
  user,
  onDelete
}: CRAProps) {
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
  }, [date, cra]);

  function save(mid, value) {
    craCollection().save(mid, value);
  }

  function fillAll() {
    const calendarToSave = calendar.map(c =>
      !c.isWeekend && !c.isJourFerie ? { ...c, cra: 1 } : c
    );
    setCalendar(calendarToSave);
    save(id, { calendar: calendarToSave, client });
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
    save(id, { calendar: calendarToSave, client });
  }

  async function saveCRA() {
    setIsSaved(save => !save);
    save(id, { isSaved: !isSaved, client });
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
    save(id, { commentaire: value, client });
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
    onDelete();
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
            <input
              type="text"
              placeholder="Nom du client"
              style={{
                border: "none",
                borderBottom: "1px solid #80808063",
                outline: "none",
                backgroundColor: "transparent",
                fontSize: "18px",
                fontWeight: "bold"
              }}
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
              <Text mx={1}>Total :</Text>
              <Text fontWeight={"bold"} fontSize={3}>
                {total}
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
                    type={
                      { "1": "circle", "0.5": "demi-circle", "0": "none" }[
                        String(c.cra)
                      ]
                    }
                    disabled={isSaved}
                    onClick={() => {
                      if (!c.isWeekend && !c.isJourFerie && !isSaved) {
                        updateCRA(c.nbOfday);
                      }
                    }}
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
                height: "120px",
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
                label="imprimer"
                fileName={`cra-${cra.client}-${cra.month}-${cra.year}.pdf`}
                document={<DocumentCRA cra={cra} user={user} />}
              />
            )}
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
}
