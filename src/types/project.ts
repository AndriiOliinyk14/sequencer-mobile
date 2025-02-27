import {Pattern} from './pattern';
import {Sample} from './sample';

export type Project = {
  id: string;
  name: string;
  patterns: Record<Sample['id'], Pattern>;
  samples: Sample[];
  bpm: number;
  patternLength: number;
  createdAt: Date;
  updatedAt: Date;
};
