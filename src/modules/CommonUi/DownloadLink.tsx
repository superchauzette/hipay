import React, { useState, useEffect } from "react";
import { storageRef } from "../FirebaseHelper";
import { useUserContext } from "../UserHelper";
import styled from "styled-components";
import { display, width, space, color } from "styled-system";

function useDownloadLink({ type, month, year, fileName }) {
  const user = useUserContext();
  const [url, setUrl] = useState("");
  useEffect(() => {
    const ndfRef = storageRef()[type]({ user, month, year })(fileName);
    ndfRef.getDownloadURL().then(setUrl);
  }, [fileName, month, type, user, year]);

  return url;
}

const Link = styled.a`
  ${width}
  ${space}
  ${display}
  ${color}
`;

export function DownloadLink({ type, month, year, fileName, ...props }) {
  const url = useDownloadLink({ type, month, year, fileName });

  return (
    <Link href={url} {...props}>
      {fileName}
    </Link>
  );
}
