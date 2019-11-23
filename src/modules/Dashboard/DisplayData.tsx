import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, Typography } from "@material-ui/core";
import { Box, Flex } from "rebass";
import { findLastIndex, take } from "lodash";
import { Chart } from "./Chart";
import { CardDisplayNumber } from "../CommonUi/CardDisplayNumber";
import { months } from "../constants";
import { Loader } from "../CommonUi/Loader";
import { Fisc } from "./Fisc";
import { InColor } from "../CommonUi/InColor";

export const formatNumber = number => {
  try {
    return parseFloat(number).toLocaleString();
  } catch (e) {
    return number;
  }
};

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

const computeChartValues = values => {
  const lastMonth = findLastIndex(values, v => v > 0);
  const noZeroValues = take(values, lastMonth + 1);
  return noZeroValues;
};

const fakeData = {
  CA: 47500.0,
  COTISATION_SOCIALES: 0,
  INCOMES: 21600.0,
  EXPENSES: 25220.24,
  TREASURY: 40242.72,
  TVA_OUTSTANDING: 11247.49,
  caOverMonthes: {
    Janvier: 10000.0,
    Février: 10000.0,
    Mars: 9000.0,
    Avril: 9500.0,
    Mai: 0,
    Juin: 2000,
    Juillet: 4440,
    Août: 0,
    Septembre: 0,
    Octobre: 0,
    Novembre: 0,
    Décembre: 0
  },
  salaryOverMonthes: {
    Janvier: 4000,
    Février: 10600,
    Mars: 5000,
    Avril: 6000,
    Mai: 5000,
    Juin: 0,
    Juillet: 0,
    Août: 0,
    Septembre: 400,
    Octobre: 0,
    Novembre: 0,
    Décembre: 0
  }
};

export function DisplayData({ quickbookObj, provisioning }) {
  const [quickBooksData, setQuickBooksData] = useState<QuickbookData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  useEffect(() => {
    const form_data = new FormData();

    const formContent = {
      quickbooks_token: quickbookObj.token,
      realm_id: quickbookObj.realmId,
      minimum_treasury: provisioning.minTreasury,
      hiway_provision: provisioning.hiwayProvision,
      accounting_provision: provisioning.accountingProvision
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
  }, [
    provisioning.accountingProvision,
    provisioning.hiwayProvision,
    provisioning.minTreasury,
    quickbookObj
  ]);
  return (
    <div style={{ padding: "10px" }}>
      {loading && (
        <div>
          <Loader />
        </div>
      )}
      {quickBooksData && (
        <Flex wrap="wrap" flexDirection={["column", "column"]}>
          <Box wrap="wrap" p={3} width={[1, 1, 1]}>
            <CardDisplayNumber
              title={
                <>
                  <InColor color="red">R</InColor>émunération
                </>
              }
              subTitle={months[currentMonth]}
            >
              {formatNumber(
                Object.values(quickBooksData.salaryOverMonthes)[currentMonth]
              )}{" "}
              €
            </CardDisplayNumber>
          </Box>
          <Typography style={{ textAlign: "center" }} variant="h5">
            Exercice {currentYear}
          </Typography>

          <Flex wrap="wrap" flexDirection={["column", "row"]}>
            <Box wrap="wrap" p={3} width={[1, 1, 2 / 3]}>
              <Card>
                <CardHeader
                  style={{ textAlign: "center" }}
                  title={
                    <>
                      <InColor color="red">A</InColor>ctivité
                    </>
                  }
                />
                <CardContent>
                  <Flex wrap="wrap" flexDirection={["column", "row"]}>
                    <Box wrap="wrap" p={3} width={[1, 1, 1 / 2]}>
                      <CardDisplayNumber title="Chiffre d'affaires">
                        {formatNumber(quickBooksData.CA)} €
                      </CardDisplayNumber>
                    </Box>
                    <Box wrap="wrap" p={3} width={[1, 1, 1 / 2]}>
                      <CardDisplayNumber title="Rémunération">
                        {formatNumber(quickBooksData.INCOMES)} €
                      </CardDisplayNumber>
                    </Box>
                  </Flex>
                  <Box wrap="wrap" p={3} width={[1]}>
                    <Chart
                      ca={computeChartValues(
                        Object.values(quickBooksData.caOverMonthes)
                      )}
                      salaries={computeChartValues(
                        Object.values(quickBooksData.salaryOverMonthes)
                      )}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Box>
            <Box wrap="wrap" p={3} width={[1, 1, 1 / 3]}>
              <Fisc />
            </Box>
          </Flex>
        </Flex>
      )}
    </div>
  );
}
