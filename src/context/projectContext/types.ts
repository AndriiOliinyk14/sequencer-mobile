import {
  Pattern,
  PatternObj,
  Project,
  Sample,
  SampleSettings,
} from '../../types';
import {PlayerState} from '../../types/enums/PlayerStatus';

export interface InitialState {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  playerStatus: PlayerState;
  patterns: PatternObj;
  samples: Sample[];
  bpm: number;
  patternLength: number;
}

export interface ContextInterface {
  state: InitialState;
  actions: {
    updatePattern: (key: string, pattern: Pattern) => void;
    setPatterns: (patterns: Record<string, Pattern>) => void;
    setPlayerStatus: (status: PlayerState) => void;
    setSample: (
      id: string,
      title: string,
      path: string,
      settings?: SampleSettings,
    ) => void;
    setRecordedSample: (
      title: string,
      filePath: string,
      settings: SampleSettings,
    ) => void;
    updateSample: (key: string, data: Partial<SampleSettings>) => void;
    replaceSample: (oldKey: string, newKey: string, newTitle: string) => void;
    removeSample: (key: string) => void;
    setBpm: (bpm: number) => void;
    setPatternLength: (length: number) => void;
    setProject: (project: Project) => void;
    resetState: () => void;
  };
}
