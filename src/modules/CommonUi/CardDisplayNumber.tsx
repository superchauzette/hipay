import React, { ReactNode, Children } from "react";
import { CardContent, Card, CardHeader, Typography } from "@material-ui/core";

type CardDisplayNumberProps = {
  children: ReactNode;
  title: string;
  subTitle?: string;
};

export function CardDisplayNumber({
  children,
  title,
  subTitle
}: CardDisplayNumberProps) {
  return (
    <Card>
      <CardHeader
        style={{ textAlign: "center", fontWeight: "lighter" }}
        title={title}
        subheader={subTitle}
      />
      <CardContent
        style={{
          textAlign: "center",
          paddingTop: "0",
          paddingBottom: "10px"
        }}
      >
        <Typography style={{ fontWeight: 600 }} variant="headline">
          {children}
        </Typography>
      </CardContent>
    </Card>
  );
}