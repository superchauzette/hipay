import React from "react";
import { Flex, Heading, Text, Box } from "rebass";
import MaterialTable from "material-table";

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

function createData(length = 30): DataType[] {
  let obj = {};
  for (let i = 1; i <= length; i++) {
    const weekend = getWeekend(i - 1);
    obj[i] = weekend ? "" : 1;
  }
  return [obj];
}

function getTotal(data: DataType[]): number {
  const total = Object.entries(data[0])
    .map(([k, v]) => v)
    .reduce((a, b) => Number(a) + Number(b), 0);
  return Number(total);
}

export function CRA() {
  const column = createColumns();
  const data = createData();
  const total = getTotal(data);

  return (
    <Flex p={3} flexDirection="column" alignItems="center">
      <Heading>Compte rendu d'Activité</Heading>
      <Text>Février 2019</Text>
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
            data={data}
            editable={{
              onRowAdd: newData =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    {
                      /* const data = this.state.data;
                              data.push(newData);
                              this.setState({ data }, () => resolve()); */
                    }
                    resolve();
                  }, 1000);
                }),
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    {
                      /* const data = this.state.data;
                              const index = data.indexOf(oldData);
                              data[index] = newData;                
                              this.setState({ data }, () => resolve()); */
                    }
                    resolve();
                  }, 1000);
                }),
              onRowDelete: oldData =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    {
                      /* let data = this.state.data;
                              const index = data.indexOf(oldData);
                              data.splice(index, 1);
                              this.setState({ data }, () => resolve()); */
                    }
                    resolve();
                  }, 1000);
                })
            }}
          />
        </Box>
      </Flex>
    </Flex>
  );
}
