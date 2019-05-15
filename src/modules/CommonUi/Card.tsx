import React from "react";
import { Card as CardRebass, CardProps } from "rebass";

type CardType = {
  children: any;
} & CardProps;

export function Card({ children, ...props }: CardType) {
  return (
    <CardRebass
      width={[1, 1, 1 / 2]}
      p={2}
      my={3}
      bg="#f6f6ff"
      borderRadius={8}
      boxShadow="0 2px 16px rgba(0, 0, 0, 0.25)"
      {...props}
    >
      {children}
    </CardRebass>
  );
}
