import {useTheme} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import uuid from 'react-native-uuid';
import {Button} from '../../components';
import {useSamplesContext} from '../../context';
import {RecorderModule} from '../../NativeModules';
import {SamplesScreenTypeEnum} from '../../types';

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

  const [file, setFile] = useState<{
    path: string;
    format: string;
  } | null>({
    path: '',
    format: '',
  });

  const handleOnRecord = () => {
    if (!trackId) return;

    RecorderModule.record(trackId);
    setRecordState(prev => ({
      ...prev,
      isRecording: true,
    }));
  };

  const handleOnStopRecording = () => {
    RecorderModule.stop(data => {
      if (!data) {
        return;
      }

      setFile(data);

      setRecordState(prev => ({
        ...prev,
        isRecording: false,
        isReadyToPlay: true,
      }));
    });
  };

  const handleOnPlay = () => {
    RecorderModule.play();
  };

  const handleOnImport = () => {
    if (!file) return;

    actions.importSample(trackId, file?.format, file.path, () => {
      RecorderModule.cleanup();
      navigation.navigate('Samples Library', {
        type: route?.params?.type ?? SamplesScreenTypeEnum.DEFAULT,
      });
    });
  };

  return (
    <View style={styles.container}>
      <Text style={{color: colors.primary}}>Recording ID: {trackId}</Text>
      <View style={styles.controlButtons}>
        <Button
          onPress={() =>
            recordState.isRecording ? handleOnStopRecording() : handleOnRecord()
          }>
          {recordState.isRecording ? 'Stop' : 'REC'}
        </Button>

        <Button onPress={handleOnPlay} disabled={!recordState.isReadyToPlay}>
          Listen
        </Button>
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
  controlButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
});
