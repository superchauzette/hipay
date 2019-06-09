import React from "react";
import { Flex, Text } from "rebass";
import IconButton from "@material-ui/core/IconButton";
import { Delete as DeleteIcon } from "@material-ui/icons";
import { BtnUpload } from "../CommonUi";

export function UploadCRA({ link, file, mkey, onFile, onDelete }) {
  function handleFile(files) {
    const file = files[0];
    onFile(file);
  }

  return (
    <Flex my={3} flexDirection="column" key={mkey}>
      <Text mb={4} color="black" textAlign="center" fontWeight="bold">
        Vous pouvez uploader votre CRA
      </Text>
      <Flex alignItems="center" flexDirection="column">
        <Flex width={"300px"} justifyContent="space-around" alignItems="center">
          <BtnUpload
            id={mkey || "btn- cra-update"}
            disabled={Boolean(file && file.name)}
            onChange={e => handleFile(e.target.files)}
          />
          {file && file.name && (
            <Flex ml={2}>
              <IconButton aria-label="Delete" onClick={onDelete}>
                <DeleteIcon />
              </IconButton>
            </Flex>
          )}
        </Flex>
        {link}
      </Flex>
    </Flex>
  );
}
