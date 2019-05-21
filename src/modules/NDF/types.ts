export type NoteType = {
  id?: string;
  dateAchat?: string;
  type?: string;
  description?: string;
  montant?: number;
  tva?: number;
  file?: any;
};

export type FileType = {
  name: string;
  type: string;
  size: number;
};
