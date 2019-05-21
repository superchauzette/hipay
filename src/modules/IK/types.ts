export type FileType = {
  name: string;
  type: string;
  size: number;
};

export type ikType = {
  id?: string;
  dateIk?: string;
  objectDeplacement?: string;
  lieuDepartArriveeRetour?: string;
  kmParcourus?: number;
  puissanceFiscale?: number;
  montant?: number;
  file?: FileType;
};
