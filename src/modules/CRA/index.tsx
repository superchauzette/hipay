import React, { useState, useEffect } from "react";
import { Flex, Heading, Box } from "rebass";
import MaterialTable from "material-table";
import { MonthSelector } from "../CommonUi/MonthSelector";
import { useUserContext } from "../UserHelper";
import { db } from "../App/fire";

type DataType = {
  [key: number]: number | string;
};

function getWeekend(k: number) {
  const firstWeekend = k + 4;
  const weekend = firstWeekend % 7 === 0 || firstWeekend % 7 === 1;
  return weekend;
}

function createColumns(length = 30) {
  return Array.from({ length }, (v, k) => {
    const weekend = getWeekend(k);

    return {
      title: String(k + 1),
      field: String(k + 1),
      cellStyle: {
        backgroundColor: weekend ? "grey" : "white"
      },
      headerStyle: {
        backgroundColor: weekend ? "grey" : "white"
      }
    };
  });
}

function createCRA(length = 30): DataType[] {
  let obj = {};
  for (let i = 1; i <= length; i++) {
    const weekend = getWeekend(i - 1);
    obj[i] = weekend ? "" : 1;
  }
  return [obj];
}

function getTotal(data: DataType[]): number {
  if (!data || data.length === 0) return 0;

  const total = Object.entries(data[0])
    .map(([k, v]) => v)
    .reduce((a, b) => Number(a) + Number(b), 0);
  return Number(total);
}

export function CRA() {
  const user = useUserContext();
  const column = createColumns();
  const [dataCra, setData] = useState([] as DataType[]);
  const [month, setMonth] = useState(0);
  const [year, setYear] = useState(0);
  const total = getTotal(dataCra);

  async function getCRA(user, month: number, year: number) {
    if (user) {
      const doc = await db()
        .collection(`users/${user.uid}/years/${year}/month/${month}/cra`)
        .doc("1")
        .get();
      const cra = doc.data();
      setData(cra && cra.cra);
    }
  }

  async function setCRA() {
    await db()
      .collection(`users/${user.uid}/years/${year}/month/${month}`)
      .add({ cra: createCRA() });
    await getCRA(user, month, year);
  }

  async function deleteCRA() {
    await db()
      .collection(`users/${user.uid}/years/${year}/month/${month}`)
      .add({ cra: [] });
    await getCRA(user, month, year);
  }

  async function changeCRA({ month, year }) {
    setMonth(month);
    setYear(year);
  }

  useEffect(() => {
    getCRA(user, month, year);
  }, [user, month, year]);

  return (
    <Flex p={3} flexDirection="column" alignItems="center">
      <Heading>Compte rendu d'Activité</Heading>
      <MonthSelector onChange={changeCRA} />
      <Flex pt={4} flexDirection="column">
        <Box mb={3}>
          <input type="text" placeholder="Nom du client" />
        </Box>
        <Box width={"96vw"}>
          <MaterialTable
            title={`Total : ${total}`}
            options={{
              search: false
            }}
            columns={column}
            data={dataCra}
            editable={{
              onRowAdd: () => {
                console.log("add");
                return db()
                  .collection(`users/${user.uid}/years/${year}/month/${month}`)
                  .doc()
                  .set({ cra: createCRA() })
                  .then(() => getCRA(user, month, year));
              },
              onRowUpdate: (newData, oldData) => {
                console.log("update");
                return db()
                  .collection(`users/${user.uid}/years/${year}/month/${month}`)
                  .doc()
                  .set({ cra: createCRA() })
                  .then(() => getCRA(user, month, year));
              },
              onRowDelete: oldData => {
                console.log("delete");
                return db()
                  .collection(`users/${user.uid}/years/${year}/month/${month}`)
                  .doc()
                  .set({ cra: [] })
                  .then(() => getCRA(user, month, year));
              }
            }}
          />
        </Box>
      </Flex>
    </Flex>
  );
}
