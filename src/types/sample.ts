export type SampleSettings = {
  volume: number;
  pan: number;
  reverb: number;
};

export type Sample = {
  key: string;
  title?: string;
  url?: string;
  settings: SampleSettings;
};
