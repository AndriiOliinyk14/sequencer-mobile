import {Pattern} from './pattern';
import {Sample} from './sample';

export type Project = {
  id: string;
  name: string;
  patterns: Record<Sample['id'], Pattern>;
  sampleIds: Sample['id'][];
  samples: Record<Sample['id'], Sample>;
  bpm: number;
  patternLength: number;
  createdAt: Date;
  updatedAt: Date;
};
