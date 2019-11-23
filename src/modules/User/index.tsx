import React, { useEffect, useState } from "react";
import { db, extractQuery } from "../FirebaseHelper";
import { Paper, Tabs, Tab, Typography, Box, useTheme } from "@material-ui/core";
import { Provisioning } from "./Provisioning";
import { AdminQuickbook } from "./AdminQuickbook";
import { TabPanel } from "../CommonUi/TabPanel";
import { Fisc } from "./Fisc";
import { userType } from "../UserHelper";

export function User({ match }) {
  const [user, setUser] = useState<userType>();
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
        .onSnapshot(qs => setUser(extractQuery(qs)));
    getUser();
  }, [match.params.id]);
  console.log(user);
  return (
    <div>
      {user && (
        <>
          <Paper square>
            <Typography variant="h3">{user.displayName}</Typography>
            <Tabs
              value={tab}
              indicatorColor="primary"
              textColor="primary"
              onChange={handleChangeTab}
              aria-label="disabled tabs example"
            >
              <Tab label="Quickbooks"></Tab>
              <Tab label="Provisioning"></Tab>
              <Tab label="Fisc & Social"></Tab>
            </Tabs>
          </Paper>
          <TabPanel value={tab} index={0} dir={theme.direction}>
            <AdminQuickbook user={user} />
          </TabPanel>
          <TabPanel value={tab} index={1} dir={theme.direction}>
            <Provisioning user={user} />
          </TabPanel>
          <TabPanel value={tab} index={2} dir={theme.direction}>
            <Fisc user={user} />
          </TabPanel>
        </>
      )}
    </div>
  );
}
