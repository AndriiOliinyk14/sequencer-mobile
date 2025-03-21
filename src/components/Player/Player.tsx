import {
  IWaveformRef,
  Waveform,
} from '@simform_solutions/react-native-audio-waveform';
import React, {FC, useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useTheme, useThrottle} from '../../hooks';
import {audioTrimmerModule, playerModule} from '../../NativeModules';
import {Card} from '../Card';
import {PlayButton} from '../PlayButton';
import {TextInput} from '../TextInput';

interface PlayerInterface {
  path: string;
  onTrim: (path: string) => void;
}

const Player: FC<PlayerInterface> = ({path, onTrim}) => {
  const [audioProperties, setAudioProperties] = useState<{duration: number}>({
    duration: 0,
  });

  const [{start, end}, setStartEnd] = useState<{
    start: string;
    end: string;
  }>({start: '0', end: '0'});

  const [isPlaying, setPlaying] = useState(false);

  const {colors} = useTheme();

  const ref = useRef<IWaveformRef>(null);

  console.log('path: ', path);

  const handleLoadAudio = async (path: string) => {
    const response = await playerModule.load(path);
    setAudioProperties(response);
    setStartEnd(prev => ({...prev, end: response.duration.toFixed(2)}));
  };

  const oneStep = audioProperties.duration / 100;
  const rangeWidth = Math.floor((Number(end) - Number(start)) / oneStep);

  const left =
    Number(start) === 0
      ? 0
      : audioProperties.duration - -Number(start) / oneStep;

  useEffect(() => {
    if (!path) return;

    handleLoadAudio(path);
  }, [path]);

  useEffect(() => {
    return () => {
      //TODO: check the isuue with cleanup
      // playerModule.cleanup();
    };
  }, []);

  const handleTrimAudio = useThrottle(async (start: number, end: number) => {
    if (!path) {
      return;
    }

    const response = await audioTrimmerModule.trim(
      path,
      Number(start),
      audioProperties.duration - Number(end),
    );

    if (response?.path) {
      onTrim(response.path);
      console.log('trimming...', response?.path);
      await playerModule.load(response?.path);
    }
  }, 200);

  const handleOnChangeStart = (e: string) => {
    const valueStart = Number(e);
    const valueEnd = Number(end);

    setStartEnd(prev => ({...prev, start: e}));

    if (valueStart < valueEnd) {
      handleTrimAudio(valueStart, valueEnd);
    }
  };

  const handleOnChangeEnd = (e: string) => {
    const valueStart = Number(start);
    const valueEnd = Number(e);

    setStartEnd(prev => ({...prev, end: e}));

    if (valueEnd > valueStart) {
      handleTrimAudio(valueStart, valueEnd);
    }
  };

  const handleOnPlay = () => {
    playerModule.play();
  };

  const handleOnStop = () => {
    playerModule.stop();
  };

  return (
    <Card>
      <View style={styles.waveform}>
        <View
          style={[
            styles.range,
            {
              backgroundColor: colors.disabled,
              width: `${rangeWidth}%`,
              left: `${left}%`,
            },
          ]}
        />
        <Waveform
          mode="static"
          ref={ref}
          path={path}
          candleSpace={0}
          candleHeightScale={8}
          candleWidth={1}
          scrubColor="white"
          waveColor={colors.white}
        />
      </View>
      <View style={styles.rangeInputs}>
        <View style={styles.rangeInputRow}>
          <TextInput
            label="In"
            placeholder="in"
            value={start || ''}
            onChangeText={handleOnChangeStart}
          />
        </View>
        <View style={[styles.rangeInputRow]}>
          <TextInput
            // textAlign="right"
            label="Out"
            placeholder="out"
            value={end || ''}
            onChangeText={handleOnChangeEnd}
          />
        </View>
      </View>
      <View style={{width: 60}}>
        <PlayButton isActive={isPlaying} onPress={handleOnPlay} />
      </View>
    </Card>
  );
};

export {Player};

const styles = StyleSheet.create({
  container: {},
  waveform: {
    position: 'relative',
    overflow: 'hidden',
  },
  rangeInputs: {
    paddingVertical: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rangeInputRow: {
    flexDirection: 'row',
  },
  range: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});
