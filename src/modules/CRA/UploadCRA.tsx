import React from "react";
import { Flex, Text } from "rebass";
import ButtonMd from "@material-ui/core/Button";

export function UploadCRA() {
  return (
    <Flex mt={3} alignItems="center" justifyContent="center">
      <Text mr={3}> Vous pouvez uploader votre CRA </Text>
      <input
        accept="image/*"
        id="contained-button-file"
        multiple
        type="file"
        style={{ display: "none" }}
      />
      <label htmlFor="contained-button-file">
        <ButtonMd variant="contained" component="span">
          Upload
        </ButtonMd>
      </label>
    </Flex>
  );
}
