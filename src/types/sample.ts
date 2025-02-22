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

export class SampleEntity {
  constructor(
    public id: string,
    public name: string,
    public path: string,
    public icon?: string,
  ) {}
}
