import React from "react";
import { Image } from "rebass";

export const Avatar = props => (
  <Image width={36} height={36} borderRadius={9999} {...props} />
);
