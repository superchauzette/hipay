export type CalandarType = {
  nbOfday: number;
  day: Date;
  isWeekend: boolean;
  isJourFerie: boolean;
  dayOfWeek: string;
  cra?: number;
};

export type FileType = {
  name: string;
  size: number;
  type: string;
};
