import {Sample, SampleEntity} from '../../types';

export interface SaveAudioInterface {
  id: string;
  name: string;
  format: string;
  binaryData: string;
}

export interface RemoveAudioInterface extends SampleEntity {}
