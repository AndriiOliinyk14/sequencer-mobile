import {useTheme} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import uuid from 'react-native-uuid';
import {Button, PlayButton, RecButton} from '../../components';
import {useSamplesContext} from '../../context';
import {recorderModule} from '../../NativeModules';
import {icons, iconsList} from '../../components/icons';

const Record = ({navigation, route}) => {
  const {colors} = useTheme();
  const {actions} = useSamplesContext();

  const [trackId, setTrackId] = useState('');

  useEffect(() => {
    setTrackId(uuid.v4());
  }, []);

  const [recordState, setRecordState] = useState({
    isRecording: false,
    isReadyToPlay: false,
  });

  const [playingState, setPlayingState] = useState({isPlaying: false});

  const [recordDuration, setRecordDuration] = useState<number>(0);

  const [file, setFile] = useState<{
    path: string;
    format: string;
  } | null>({
    path: '',
    format: '',
  });

  useEffect(() => {
    let interval: any = null;

    if (recordState.isRecording) {
      setRecordDuration(0);

      interval = setInterval(() => {
        setRecordDuration(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
      setRecordDuration(0);
    }

    return () => clearInterval(interval);
  }, [recordState.isRecording]);

  useEffect(() => {
    if (!file) return;

    () => {
      recorderModule.cleanup();
    };
  }, [file]);

  const handleOnStartRecord = async () => {
    if (!trackId) return;

    try {
      await recorderModule.record(trackId);
      setRecordState(prev => ({
        ...prev,
        isRecording: true,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnStopRecording = async () => {
    const response = await recorderModule.stopRecording();

    if (response?.path) {
      setFile(response);

      setRecordState(prev => ({
        ...prev,
        isRecording: false,
        isReadyToPlay: true,
      }));
    }
  };

  const handleOnPlay = () => {
    setPlayingState(prev => ({...prev, isPlaying: true}));
  };

  const handleOnStop = () => {
    recorderModule.stopRecording();
    setPlayingState(prev => ({...prev, isPlaying: true}));
  };

  const handleOnImport = () => {
    if (!file) return;

    actions.importSample(
      trackId,
      file?.format,
      icons.mic.uri,
      file.path,
      () => {
        recorderModule.cleanup();
        navigation.goBack();
      },
    );
  };

  const handleOnPressRec = (isRecording: boolean) => {
    isRecording ? handleOnStopRecording() : handleOnStartRecord();
  };

  const handleOnPressPlay = (isPlaying: boolean) => {
    handleOnPlay();
  };

  return (
    <View style={styles.container}>
      <Text style={{color: colors.primary}}>Recording ID: {trackId}</Text>
      <Text style={[styles.duration, {color: colors.text}]}>
        {`Record duration: ${recordDuration} sec`}
      </Text>
      <View style={styles.controlButtons}>
        <RecButton
          isActive={recordState.isRecording}
          onPress={() => handleOnPressRec(recordState.isRecording)}
        />
        <PlayButton
          onPress={handleOnPlay}
          isActive={false} // disabled={!recordState.isReadyToPlay}
          disabled={!recordState.isReadyToPlay}
        />
      </View>
      {file?.path && (
        <Button onPress={handleOnImport}>Import sample to library</Button>
      )}
    </View>
  );
};

export default Record;

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    display: 'flex',
    gap: 20,
  },
  duration: {},
  controlButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
});
