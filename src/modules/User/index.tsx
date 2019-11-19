import React, { useEffect, useState } from "react";
import { db, extractQuery } from "../FirebaseHelper";
import { Paper, Tabs, Tab, Typography, Box, useTheme } from "@material-ui/core";
import { Provisioning } from "./Provisioning";
import { AdminQuickbook } from "./AdminQuickbook";

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

export function User({ match }) {
  const [user, setUser] = useState();
  const [tab, setTab] = React.useState(0);
  const theme = useTheme();

  const handleChangeTab = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTab(newValue);
  };

  useEffect(() => {
    const getUser = () =>
      db()
        .collection("users")
        .doc(match.params.id)
        .get()
        .then(extractQuery)
        .then(setUser);
    getUser();
  }, [match.params.id]);

  return (
    <div>
      {user && (
        <>
          <Paper square>
            <Tabs
              value={tab}
              indicatorColor="primary"
              textColor="primary"
              onChange={handleChangeTab}
              aria-label="disabled tabs example"
            >
              <Tab label="Quickbooks"></Tab>
              <Tab label="Provisioning"></Tab>
            </Tabs>
          </Paper>
          <TabPanel value={tab} index={0} dir={theme.direction}>
            <AdminQuickbook user={user} />
          </TabPanel>
          <TabPanel value={tab} index={1} dir={theme.direction}>
            <Provisioning user={user} />
          </TabPanel>
        </>
        // <div
        //   style={{
        //     display: "flex",
        //     alignItems: "center",
        //     flexDirection: "column"
        //   }}
        // >
        //   <Header title={user.info.displayName} />
        //   <AdminQuickbook user={user} handleChange={handleChange} />
        //   <QuickbookData user={user} />
        // </div>
      )}
    </div>
  );
}
