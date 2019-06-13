import React, { useEffect, useState, Fragment } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Divider
} from "@material-ui/core";
import { Box, Flex } from "rebass";
import { Chart } from "./Chart";
import { paddingTop } from "styled-system";
import { CardDisplayNumber } from "../CommonUi/CardDisplayNumber";

export interface NumberOverMonths {
  Janvier: number;
  Février: number;
  Mars: number;
  Avril: number;
  Mai: number;
  Juin: number;
  Juillet: number;
  Août: number;
  Septembre: number;
  Octobre: number;
  Novembre: number;
  Décembre: number;
}

export type QuickbookData = {
  CA: number;
  COTISATION_SOCIALES: number;
  INCOMES: number;
  EXPENSES: number;
  TREASURY: number;
  TVA_OUTSTANDING: number;
  caOverMonthes: NumberOverMonths;
  salaryOverMonthes: NumberOverMonths;
};

type QuickBookResponse = {
  dashboardData: QuickbookData;
};

// const fakeData = {
//   CA: 47500.0,
//   COTISATION_SOCIALES: 0,
//   INCOMES: 21600.0,
//   EXPENSES: 25220.24,
//   TREASURY: 40242.72,
//   TVA_OUTSTANDING: 11247.49,
//   caOverMonthes: {
//     Janvier: 10000.0,
//     Février: 10000.0,
//     Mars: 9000.0,
//     Avril: 9500.0,
//     Mai: 9000.0,
//     Juin: 0,
//     Juillet: 0,
//     Août: 0,
//     Septembre: 0,
//     Octobre: 0,
//     Novembre: 0,
//     Décembre: 0
//   },
//   salaryOverMonthes: {
//     Janvier: 4000,
//     Février: 10600,
//     Mars: 5000,
//     Avril: 6000,
//     Mai: 5000,
//     Juin: 0,
//     Juillet: 0,
//     Août: 0,
//     Septembre: 0,
//     Octobre: 0,
//     Novembre: 0,
//     Décembre: 0
//   }
// };

export function DisplayData({ quickbookObj }) {
  const [quickBooksData, setQuickBooksData] = useState<QuickbookData | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const form_data = new FormData();

    const formContent = {
      quickbooks_token: quickbookObj.token,
      realm_id: quickbookObj.realmId
    };
    for (var key in formContent) {
      form_data.append(key, formContent[key]);
    }
    setLoading(true);
    fetch("https://hiwayapi-demo.herokuapp.com/index.php/api/quickbooksdata", {
      method: "POST",
      body: form_data
    })
      .then(res => res.json())
      .then((data: QuickBookResponse) => setQuickBooksData(data.dashboardData))
      .finally(() => setLoading(false));
  }, [quickbookObj]);
  return (
    <div style={{ padding: "10px" }}>
      {/* {loading && 
      <Spinnger
      } */}
      {quickBooksData && (
        <Flex wrap="wrap" flexDirection={["column", "column"]}>
          <Box wrap="wrap" p={3} width={[1, 1, 1]}>
            <CardDisplayNumber title="Rémunération" subTitle="Juin">
              {quickBooksData.INCOMES} €
            </CardDisplayNumber>
          </Box>
          <Typography style={{ textAlign: "center" }} variant="h5">
            Exercice 2019
          </Typography>

          <Flex wrap="wrap" flexDirection={["column", "row"]}>
            <Box wrap="wrap" p={3} width={[1, 1, 2 / 3]}>
              <Card>
                <CardHeader style={{ textAlign: "center" }} title="Activité" />
                <CardContent>
                  <Flex wrap="wrap" flexDirection={["column", "row"]}>
                    <Box wrap="wrap" p={3} width={[1, 1, 1 / 2]}>
                      <CardDisplayNumber title="Chiffre d'affaire">
                        {quickBooksData.CA} €
                      </CardDisplayNumber>
                    </Box>
                    <Box wrap="wrap" p={3} width={[1, 1, 1 / 2]}>
                      <CardDisplayNumber title="Rémunération">
                        {quickBooksData.INCOMES} €
                      </CardDisplayNumber>
                    </Box>
                  </Flex>
                  <Box wrap="wrap" p={3} width={[1]}>
                    <Chart
                      ca={Object.values(quickBooksData.caOverMonthes)}
                      salaries={Object.values(quickBooksData.salaryOverMonthes)}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Box>
            <Box wrap="wrap" p={3} width={[1, 1, 1 / 3]}>
              <Card>
                <CardHeader
                  style={{ textAlign: "center" }}
                  title="Fisc & social"
                />
                <CardContent>
                  <Box p={3} width={[1, 1, 1]}>
                    <CardDisplayNumber title="Encours TVA">
                      {quickBooksData.TVA_OUTSTANDING} €
                    </CardDisplayNumber>
                  </Box>
                  <Box p={3} width={[1, 1, 1]}>
                    <CardDisplayNumber title="Estimation cotisations sociales">
                      {quickBooksData.COTISATION_SOCIALES} €
                    </CardDisplayNumber>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Flex>
        </Flex>
      )}
    </div>
  );
}
