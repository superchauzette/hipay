import React, { useEffect, useState } from "react";
import { Card } from "../CommonUi";
import { CardHeader, CardContent } from "@material-ui/core";

export interface CaOverMonthe {
  janvier: number;
  février: number;
  mars: number;
  avril: number;
  mai: number;
  juin: number;
  juillet: number;
  août: number;
  septembre: number;
  octobre: number;
  novembre: number;
  décembre: number;
}

export interface SalaryOverMonthe {
  janvier: number;
  février: number;
  mars: number;
  avril: number;
  mai: number;
  juin: number;
  juillet: number;
  août: number;
  septembre: number;
  octobre: number;
  novembre: number;
  décembre: number;
}

export type QuickbookData = {
  CA: number;
  COTISATION_SOCIALES: number;
  INCOMES: number;
  EXPENSES: number;
  TREASURY: number;
  TVA_OUTSTANDING: number;
  aOverMonthes: CaOverMonthe;
  salaryOverMonthes: SalaryOverMonthe;
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
    <div>
      {quickBooksData && (
        <Card>
          <div>
            Rémunération
            {quickBooksData.INCOMES}
          </div>
        </Card>
      )}
    </div>
  );
}
