import {useTheme} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import uuid from 'react-native-uuid';
import {Button, Card, PlayButton, RecButton, TextInput} from '../../components';
import {icons} from '../../components/icons';
import {useSamplesContext} from '../../context';
import {playerModule, recorderModule} from '../../NativeModules';

const Record = ({navigation, route}) => {
  const {colors} = useTheme();
  const {actions} = useSamplesContext();

  const [name, setName] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [trackId, setTrackId] = useState('');

  useEffect(() => {
    setTrackId(uuid.v4());
  }, []);

  const [recordState, setRecordState] = useState({
    isRecording: false,
    isReadyToPlay: false,
  });

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
      await playerModule.load(response.path);

      setRecordState(prev => ({
        ...prev,
        isRecording: false,
        isReadyToPlay: true,
      }));
    }
  };

  const handleOnPlay = () => {
    playerModule.play();
  };

  const handleOnImport = () => {
    if (!file) return;

    if (!name) {
      setErrors(prev => ({...prev, name: 'Name is required'}));
      return;
    }

    actions.importSample(name, file?.format, icons.mic.uri, file.path, () => {
      recorderModule.cleanup();
      navigation.goBack();
    });
  };

  const handleOnPressRec = (isRecording: boolean) => {
    isRecording ? handleOnStopRecording() : handleOnStartRecord();
  };

  const handleOnChangeName = (value: string) => {
    setErrors({});
    setName(value);
  };

  return (
    <View style={styles.container}>
      <Card style={styles.body}>
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
            isActive={false}
            disabled={!recordState.isReadyToPlay}
          />
        </View>
        {file?.path && (
          <>
            <TextInput
              label="Name"
              onChangeText={handleOnChangeName}
              value={name}
              error={errors?.name}
            />
            <Button onPress={handleOnImport}>Import sample to library</Button>
          </>
        )}
      </Card>
    </View>
  );
};

export default Record;

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
  },
  body: {
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
