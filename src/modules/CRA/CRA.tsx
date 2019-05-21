import React, { useState, useEffect } from "react";
import { Flex, Box, Text } from "rebass";
import { Delete as DeleteIcon } from "@material-ui/icons";
import {
  getCraFirebase,
  getCalculatedCalendar,
  calendarCol,
  storageCRA
} from "./service";
import { userType } from "../UserHelper";
import { Card } from "../CommonUi/Card";
import { DayofWeekMobile } from "./DayofWeekMobile";
import { UploadCRA } from "./UploadCRA";
import { MyInput } from "../CommonUi/MyInput";
import { MyBox } from "../CommonUi/MyBox";
import { CalandarType } from "./CalandarType";
import { WhiteSpace } from "./WhiteSpace";
import IconButton from "@material-ui/core/IconButton";
import { Button } from "@material-ui/core";

type CRAProps = {
  id: string;
  date: Date;
  month: number;
  year: number;
  user: userType;
  showTrash: boolean;
  onDelete: (id: string) => void;
};

export const tabDays = ["lu", "ma", "me", "je", "ve", "sa", "di"];

function getTotal(calendar: CalandarType[]): number {
  if (calendar.length === 0) return 0;

  const total = calendar
    .map(c => c.cra || 0)
    .reduce((a, b) => Number(a) + Number(b), 0);

  return Number(total);
}

export function CRA({
  id,
  showTrash,
  date,
  month,
  year,
  user,
  onDelete
}: CRAProps) {
  const [calendar, setCalendar] = useState([] as CalandarType[]);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [client, setClient] = useState();
  const [commentaire, setCommentaire] = useState("");
  const [file, setFile] = useState();
  const total = getTotal(calendar);

  useEffect(() => {
    (async function init() {
      const calendarCal = await getCalculatedCalendar(date);
      setCalendar(calendarCal);
      const craData = await getCraFirebase(id, user, month, year);
      if (craData) {
        if (craData.calendar) setCalendar(craData.calendar);
        setIsSaved(craData.isSaved);
        setClient(craData.client || localStorage.getItem("client"));
        setFile(craData.file);
      }
    })();
  }, [date, month, year, user, id]);

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
      await calendarCol({ user, month, year })
        .doc(id)
        .set(
          {
            calendar,
            total,
            isSaved: true,
            client,
            commentaire
          },
          { merge: true }
        );
      setLoading(false);
    }
  }

  async function saveFileInfo(fileUploaded: {
    name: string;
    size: number;
    type: string;
  }) {
    setFile(fileUploaded);
    storageCRA({ user, month, year })(fileUploaded.name).put(fileUploaded);
    calendarCol({ user, month, year })
      .doc(id)
      .set(
        {
          file: {
            name: fileUploaded.name,
            size: fileUploaded.size,
            type: fileUploaded.type
          }
        },
        { merge: true }
      );
  }

  async function deleteCRA() {
    onDelete(id);
    await calendarCol({ user, month, year })
      .doc(id)
      .delete();
  }

  function saveClient(e) {
    const value = e.target.value;
    setClient(value);
    localStorage.setItem(`client`, value);
  }

  async function deleteCRAUpload() {
    calendarCol({ user, month, year })
      .doc(id)
      .set(
        {
          file: {}
        },
        { merge: true }
      );
    storageCRA({ user, month, year })(file.name).delete();
    setFile({});
  }

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
            {showTrash && (
              <IconButton aria-label="Delete" onClick={deleteCRA}>
                <DeleteIcon />
              </IconButton>
            )}
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
                      key={`${id}-${month}-${year}-${c.nbOfday}-${c.dayOfWeek}`}
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
          <Flex alignItems="center" mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={saveCRA}
              disabled={!Boolean(client)}
            >
              {isSaved ? "Modifier" : "Sauvegarder"}
            </Button>
            {isLoading && isSaved && <Text ml={3}>...Loading</Text>}
            {!isLoading && isSaved && (
              <Text ml={3}>Votre CRA a été sauvegardé</Text>
            )}
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
}
