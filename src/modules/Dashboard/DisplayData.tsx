import React, { useEffect, useState, Fragment } from "react";
import { Card, CardHeader, CardContent } from "@material-ui/core";
import { Box, Flex } from "rebass";
import { Chart } from "./Chart";

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
            <Card raised color="#FFF">
              <CardHeader
                style={{ textAlign: "center" }}
                subheader="Juin"
                title="Rémunération"
              />
              <CardContent style={{ textAlign: "center" }}>
                <h3>{quickBooksData.INCOMES} €</h3>
              </CardContent>
            </Card>
          </Box>
          <Flex wrap="wrap" flexDirection={["column", "row"]}>
            <Box wrap="wrap" p={3} width={[1, 1, 1 / 2]}>
              <Card raised color="#FFF">
                <CardHeader
                  style={{ textAlign: "center" }}
                  subheader="2019"
                  title="Chiffre d'affaire"
                />
                <CardContent style={{ textAlign: "center" }}>
                  <h3>{quickBooksData.CA} €</h3>
                </CardContent>
              </Card>
            </Box>
            <Box wrap="wrap" p={3} width={[1, 1, 1 / 2]}>
              <Card raised color="#FFF">
                <CardHeader
                  style={{ textAlign: "center" }}
                  subheader="Aujourd'hui"
                  title="Trésorie"
                />
                <CardContent style={{ textAlign: "center" }}>
                  <h3>{quickBooksData.TREASURY} €</h3>
                </CardContent>
              </Card>
            </Box>
          </Flex>
          <Chart
            ca={Object.values(quickBooksData.caOverMonthes)}
            salaries={Object.values(quickBooksData.salaryOverMonthes)}
          />
        </Flex>
      )}
    </div>
  );
}
