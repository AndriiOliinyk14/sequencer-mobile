export type SampleSettings = {
  volume: number;
  pan: number;
  reverb: number;
};

export class SampleEntity {
  constructor(
    public id: string,
    public name: string,
    public path: string,
    public icon?: string,
  ) {}
}

export type Sample = SampleEntity & {
  title: string;
  settings: SampleSettings;
};
