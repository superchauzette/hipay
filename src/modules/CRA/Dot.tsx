import React from "react";
import { Flex, Box } from "rebass";

export type DotProps = {
  type: "circle" | "demi-circle" | "none";
  disabled: boolean;
  children: React.ReactNode;
  onClick: () => void;
};

export function Dot({
  type = "none",
  disabled = false,
  children,
  onClick
}: DotProps) {
  function getBackgrond(type: "circle" | "demi-circle" | "none") {
    return {
      circle: {
        height: "35px",
        width: "35px",
        borderRadius: "50%",
        color: "white",
        backgroundColor: disabled ? "gray" : "rgb(225, 0, 80)"
      },
      "demi-circle": {
        height: "calc(35px / 2)",
        width: "35px",
        borderRadius: "17.5px 17.5px 0 0",
        color: "black",
        backgroundColor: disabled ? "gray" : "rgb(225, 0, 80)"
      },
      none: {
        height: "35px",
        width: "35px",
        borderRadius: "50%",
        color: "black",
        backgroundColor: "white"
      }
    }[type];
  }

  return (
    <Box p={1}>
      <Box
        style={{
          height: "35px",
          width: "35px",
          position: "relative"
        }}
      >
        <Flex
          justifyContent="center"
          style={{
            cursor: "pointer",
            overflow: "hidden",
            ...getBackgrond(type)
          }}
          onClick={onClick}
        >
          <Flex
            justifyContent="center"
            alignItems="center"
            style={{
              height: "100%",
              width: "100%",
              position: "absolute"
            }}
          >
            {children}
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}
