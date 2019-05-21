import React from "react";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { Button } from "@material-ui/core";

type BtnUploadProps = {
  id: string;
  disabled?: boolean;
  onChange: (e: any) => void;
};

export function BtnUpload({ id, disabled, onChange }: BtnUploadProps) {
  return (
    <>
      <input
        accept="image/*"
        id={id}
        // multiple
        type="file"
        disabled={disabled}
        style={{ display: "none" }}
        onChange={onChange}
      />
      <label htmlFor={id}>
        <Button variant="contained" component="span" disabled={disabled}>
          Upload
          <CloudUploadIcon style={{ marginLeft: "8px" }} />
        </Button>
      </label>
    </>
  );
}
