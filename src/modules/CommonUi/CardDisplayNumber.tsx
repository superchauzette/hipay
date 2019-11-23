import React, { ReactNode } from "react";
import { CardContent, Card, CardHeader, Typography } from "@material-ui/core";

type CardDisplayNumberProps = {
  children: ReactNode;
  title: React.ReactNode;
  subTitle?: string;
  valueVariant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "subtitle1"
    | "subtitle2"
    | "body1"
    | "body2"
    | "caption"
    | "button"
    | "overline"
    | "srOnly"
    | "inherit"
    | undefined;
};

export function CardDisplayNumber({
  children,
  title,
  subTitle,
  valueVariant = "h6"
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
        <Typography
          color="primary"
          style={{ fontWeight: 600 }}
          variant={valueVariant}
        >
          {children}
        </Typography>
      </CardContent>
    </Card>
  );
}
