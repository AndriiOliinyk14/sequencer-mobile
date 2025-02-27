import {SampleEntity} from '../../types';

export interface InitialState {
  samples: SampleEntity[];
  samplesObj: Record<string, SampleEntity>;
}

export interface ContextInterface {
  state: InitialState;
  actions: {
    setSample: (sample: SampleEntity) => void;
    importSample: (
      name: string,
      format: string,
      uri: string,
      navigate: any,
    ) => void;
    getAllSamples: () => void;
  };
}
