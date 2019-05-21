import React from "react";
import { Image } from "rebass";

export const Avatar = props => (
  <Image width={42} height={42} borderRadius={9999} {...props} />
);
