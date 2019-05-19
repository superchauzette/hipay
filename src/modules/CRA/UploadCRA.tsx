import React from "react";
import { Flex, Text } from "rebass";
import ButtonMd from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

export function UploadCRA({ file, key, onFile }) {
  function handleFile(files) {
    const file = files[0];
    onFile(file);
  }

  return (
    <Flex my={3} flexDirection="column" key={key}>
      <Text mb={2} color="black">
        Vous pouvez uploader votre CRA
      </Text>
      <Flex alignItems="center">
        <input
          accept="image/*"
          id="contained-button-file"
          // multiple
          type="file"
          style={{ display: "none" }}
          onChange={e => handleFile(e.target.files)}
        />
        <label htmlFor="contained-button-file">
          <ButtonMd variant="contained" component="span">
            Upload
            <CloudUploadIcon style={{ marginLeft: "8px" }} />
          </ButtonMd>
        </label>

        <Text ml={3}>{file && file.name}</Text>
      </Flex>
    </Flex>
  );
}
