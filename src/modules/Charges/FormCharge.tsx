import React, { useState } from "react";
import { Flex } from "rebass";
import { TextField, BtnUpload, BtnDelete, DownloadLink } from "../CommonUi";
import { ChargeType, FileType } from "./types";

type FormIkProps = {
  charge: ChargeType;
  onChange: (charge: ChargeType) => void;
  onDelete: (id: string | undefined) => void;
  onUpdateFile: (file: FileType) => void;
};

export function FormCharge({
  charge,
  onChange,
  onDelete,
  onUpdateFile
}: FormIkProps) {
  const [file, setFile] = useState(charge.file);

  function handleFile(files) {
    const file: FileType = files[0];
    setFile(file);
    onChange({ file: { name: file.name, size: file.size, type: file.type } });
    onUpdateFile(file);
  }

  return (
    <form
      noValidate
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        padding: "0 10px",
        marginTop: "10px"
      }}
    >
      <TextField
        id="description"
        label="Description"
        width={["100%", "450px"]}
        value={charge.description}
        onChange={e => onChange({ description: e.target.value })}
      />
      <Flex width={["100%", "10%"]}>
        <BtnUpload
          id={`btn-ik-upload-${charge.id}`}
          disabled={Boolean(file && file.name)}
          onChange={e => handleFile(e.target.files)}
        />
      </Flex>
      <Flex>
        {file && (
          <DownloadLink
            type="charges"
            month={charge.month}
            year={charge.year}
            fileName={file.name}
            label={"charge"}
            mt={2}
            ml={3}
          />
        )}
      </Flex>
      <BtnDelete onClick={() => onDelete(charge.id)} />
    </form>
  );
}
