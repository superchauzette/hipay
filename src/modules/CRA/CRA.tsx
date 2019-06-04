import React, { useState, useEffect } from "react";
import { Flex, Box, Text } from "rebass";
import {
  getCalculatedCalendar,
  storageCRA,
  craCollection,
  userCol
} from "./service";
import { userType } from "../UserHelper";
import { Card, MyInput, MyBox, BtnDelete, LinkPdf } from "../CommonUi";
import { DayofWeekMobile } from "./DayofWeekMobile";
import { UploadCRA } from "./UploadCRA";
import { CalandarType } from "./types";
import { WhiteSpace } from "./WhiteSpace";
import { Button } from "@material-ui/core";
import { DocumentCRA } from "./pdf";

type CRAProps = {
  cra: any;
  date: Date;
  month: number;
  year: number;
  user: userType;
  showTrash?: boolean;
};

export const tabDays = ["lu", "ma", "me", "je", "ve", "sa", "di"];

function getTotal(calendar: CalandarType[]): number {
  if (calendar.length === 0) return 0;

  const total = calendar
    .map(c => c.cra || 0)
    .reduce((a, b) => Number(a) + Number(b), 0);

  return Number(total);
}

export function CRA({ cra, showTrash, date, month, year, user }: CRAProps) {
  const [calendar, setCalendar] = useState([] as CalandarType[]);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [client, setClient] = useState("");
  const [commentaire, setCommentaire] = useState("");
  const [file, setFile] = useState();
  const total = getTotal(calendar);
  const id = cra.id ? cra.id : "new";

  useEffect(() => {
    (async function init() {
      if (cra.calendar) {
        setCalendar(cra.calendar);
        setIsSaved(cra.isSaved);
        setClient(cra.client || localStorage.getItem("client"));
        setFile(cra.file);
        setCommentaire(cra.commentaire);
      } else {
        const calendarCal = await getCalculatedCalendar(date);
        setCalendar(calendarCal);
      }
    })();
  }, [date, cra.calendar, cra.isSaved, cra.client, cra.file, cra.commentaire]);

  function fillAll() {
    setCalendar(calendar =>
      calendar.map(c => (!c.isWeekend && !c.isJourFerie ? { ...c, cra: 1 } : c))
    );
  }

  function updateCRA(nbOfday: number, value: string) {
    setCalendar(calendar =>
      calendar.map(c =>
        c.nbOfday === nbOfday ? { ...c, cra: Number(value) } : c
      )
    );
  }

  async function saveCRA() {
    setIsSaved(save => !save);
    if (!isSaved) {
      setLoading(true);
      const craToSave = {
        userid: user.uid,
        month,
        year,
        calendar,
        total,
        isSaved: true,
        client,
        commentaire,
        user: userCol().doc(user.uid)
      };
      await craCollection().createOrUpdate(id, craToSave);
      setLoading(false);
    } else {
      await craCollection().createOrUpdate(id, { isSaved: !isSaved });
    }
  }

  async function saveFileInfo(fileUploaded) {
    setFile(fileUploaded);
    storageCRA({ user, month, year })(fileUploaded.name).put(fileUploaded);
    craCollection().createOrUpdate(id, {
      file: {
        name: fileUploaded.name,
        size: fileUploaded.size,
        type: fileUploaded.type
      }
    });
  }

  async function deleteCRA() {
    setCalendar([]);
    craCollection().remove(id);
  }

  function saveClient(e) {
    const value = e.target.value;
    setClient(value);
    localStorage.setItem(`client`, value);
  }

  async function deleteCRAUpload() {
    craCollection().createOrUpdate(id, { file: {} });
    storageCRA({ user, month, year })(file.name).delete();
    setFile({});
  }

  if (!calendar.length) return null;

  return (
    <Flex flexDirection="column" width={1}>
      <UploadCRA
        key={`${id}-${month}-${year}`}
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
              value={client}
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

          <Box width={["100%"]} mt={2}>
            <Flex
              justifyContent={["flex-start", "flex-start", "space-between"]}
              flexWrap={["wrap", "wrap", "nowrap"]}
            >
              <DayofWeekMobile tabDays={tabDays} />
              <WhiteSpace calendar={calendar} tabDays={tabDays} />

              {calendar.map(c => (
                <Box
                  key={`${id}-${month}-${year}-${c.nbOfday}`}
                  width={[1 / 7, "40px", 1]}
                  color={c.isWeekend || c.isJourFerie ? "grey" : "black"}
                >
                  <MyBox display={["none", "block"]}>
                    <Text textAlign="center">{c.dayOfWeek}</Text>
                  </MyBox>
                  <Text textAlign="center" p={1}>
                    {c.nbOfday}
                  </Text>
                  <Box pt={1}>
                    <MyInput
                      key={`${month}-${year}-${c.nbOfday}-${c.dayOfWeek}`}
                      type="number"
                      max="1"
                      min="0"
                      step="0.5"
                      name="craValue"
                      value={c.cra}
                      onChange={e => updateCRA(c.nbOfday, e.target.value)}
                      disabled={c.isWeekend || c.isJourFerie || isSaved}
                    />
                  </Box>
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
              value={commentaire}
              onChange={e => setCommentaire(e.target.value)}
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
                {isSaved ? "Modifier" : "Sauvegarder"}
              </Button>
              {!isLoading && !isSaved && (
                <Text ml={3} style={{ fontStyle: "italic" }} fontSize={"10px"}>
                  Pensez à renseigner votre client
                </Text>
              )}
              {isLoading && isSaved && <Text ml={3}>...Loading</Text>}
              {!isLoading && isSaved && (
                <Text ml={3}>Votre CRA a été sauvegardé</Text>
              )}
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
