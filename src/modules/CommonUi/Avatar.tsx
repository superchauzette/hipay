import React from "react";
import { Image } from "rebass";

export const Avatar = props => (
  <Image width={48} height={48} borderRadius={9999} {...props} />
);
