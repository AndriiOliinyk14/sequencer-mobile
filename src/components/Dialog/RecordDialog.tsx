import React, {useEffect} from 'react';
import {Button, StyleSheet, TextInput} from 'react-native';

import {RecorderModule} from '../../NativeModules';
import {useGlobalContext} from '../../context/globalContext';
import {DialogEnum} from '../../types';
import {Dialog} from './Dialog';

const RecordDialog = () => {
  const {state, actions} = useGlobalContext();
  const {samples, dialogs} = state;

  const [trackName, setTrackName] = React.useState('');

  useEffect(() => {
    const defaultTrackName = () => `Track_${samples.length + 1}`;

    setTrackName(defaultTrackName);
  }, [samples.length]);

  const [isRecording, setRecording] = React.useState(false);
  const [isReadyToPlay, setReadyToPlay] = React.useState(false);
  const [filePath, setFilePath] = React.useState('');

  const handleOnRecord = () => {
    RecorderModule.record(trackName);
    setReadyToPlay(false);
    setRecording(true);
  };

  const handleOnStop = () => {
    RecorderModule.stop(data => {
      if (!data) {
        return;
      }

      setRecording(false);
      setReadyToPlay(true);
      setFilePath(data);
    });
  };

  const handleOnPlay = () => {
    RecorderModule.play();
  };

  const handleOnAddToSampler = () => {
    const settings = {
      volume: 1,
      pan: 0,
      reverb: 0,
    };

    actions.setRecordedSample(trackName, filePath, settings);
    actions.closeDialog(DialogEnum.RECORD);
  };

  const handleOnTextChange = (text: string) => {
    if (
      samples.some(sample => sample.key.toLowerCase() === text.toLowerCase())
    ) {
      setTrackName(`${text}_1`);
      return;
    }

    setTrackName(text);
  };

  const handleOnClose = () => {
    RecorderModule.stop();
    actions.closeDialog(DialogEnum.RECORD);
  };

  return (
    <Dialog isVisible={dialogs.RECORD.visible} onClose={handleOnClose}>
      <>
        <TextInput
          style={styles.textField}
          placeholder="Name"
          value={trackName}
          onChangeText={handleOnTextChange}
        />
        <Button
          color={isRecording ? 'red' : 'blue'}
          title="REC"
          onPress={handleOnRecord}
        />
        <Button title="Stop" onPress={handleOnStop} />
        <Button
          disabled={!isReadyToPlay}
          title="Play Recorded"
          onPress={handleOnPlay}
        />
        <Button
          disabled={!isReadyToPlay}
          title="Add to Sampler"
          onPress={handleOnAddToSampler}
        />
      </>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  textField: {
    padding: 10,
    margin: 10,
    backgroundColor: 'lightgrey',
    borderRadius: 5,
  },
});

export {RecordDialog};
