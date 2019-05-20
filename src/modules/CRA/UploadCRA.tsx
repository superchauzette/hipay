import React from "react";
import { Flex, Text } from "rebass";
import ButtonMd from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import IconButton from "@material-ui/core/IconButton";
import { Delete as DeleteIcon } from "@material-ui/icons";

export function UploadCRA({ file, key, onFile, onDelete }) {
  function handleFile(files) {
    const file = files[0];
    onFile(file);
  }

  return (
    <Flex my={3} flexDirection="column" key={key}>
      <Text mb={4} color="black" textAlign="center" fontWeight="bold">
        Vous pouvez uploader votre CRA
      </Text>
      <Flex alignItems="center" flexDirection="column">
        <Flex width={"300px"} justifyContent="space-around" alignItems="center">
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
          {file && file.name && (
            <Flex ml={2}>
              <IconButton aria-label="Delete" onClick={onDelete}>
                <DeleteIcon />
              </IconButton>
            </Flex>
          )}
        </Flex>

        <Text mt={3}>{file && file.name}</Text>
      </Flex>
    </Flex>
  );
}
