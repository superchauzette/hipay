export type FileType = {
  name: string;
  type: string;
  size: number;
};

export type ChargeType = {
  id?: string;
  description?: string;
  file?: FileType;
};
