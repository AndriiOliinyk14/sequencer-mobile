import {useNavigation, useRoute, useTheme} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Alert, Button, StyleSheet, Text, View} from 'react-native';
import {TextInput} from '../../components';
import {useSamplesContext} from '../../context';
import {audioTrimmerModule} from '../../NativeModules/AudioTrimmer/AudioTrimmer';
import {sampleStorageService} from '../../services';
import {SampleEntity} from '../../types';
import {playerModule} from '../../NativeModules/Player/Player';

const EditSample = () => {
  const {colors} = useTheme();
  const navigation = useNavigation();

  const route = useRoute<{key: string; params: {id: string}; name: string}>();

  const [sample, setSample] = useState<SampleEntity>();
  const [values, setValues] = useState<{name: string}>({name: ''});

  const [inAudio, setInAudio] = useState('');
  const [outAudio, setOutAudio] = useState('');

  const [trimmedFile, setTrimmedFile] = useState<any>();

  const {actions} = useSamplesContext();

  useEffect(() => {
    const fetchSample = async () => {
      const data = await sampleStorageService.get(route.params.id);

      if (!data) return;

      setValues({name: data.name});
      setSample(data);
    };
    fetchSample();
  }, []);

  //Test functionnality
  const handleTrimAudio = async () => {
    if (sample?.path) {
      const response = await audioTrimmerModule.trim(
        sample?.path,
        Number(inAudio),
        Number(outAudio),
      );
      setTrimmedFile(response);
    }
  };

  const handleOnPlayTrimmed = async () => {
    if (!trimmedFile) return;
    console.log(trimmedFile);
    await playerModule.play(trimmedFile.path);
  };

  const handleOnSave = async (
    sample: SampleEntity,
    values: Partial<SampleEntity>,
  ) => {
    try {
      const data = {...sample, ...values};
      await sampleStorageService.update(data);
      actions.getAllSamples();

      Alert.alert('Sample was saved successfully');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!sample) return;

    navigation.setOptions({
      headerRight: () => (
        <Button title="Save" onPress={() => handleOnSave(sample, values)} />
      ),
      title: `Editing ${sample.name}`,
    });
  }, [navigation, sample, values]);

  const handleOnInput = (value: {[key: string]: string}) => {
    setValues(state => ({...state, ...value}));
  };

  const handleOnRemove = (sample: SampleEntity) => {
    Alert.alert(
      'Remove Sample',
      'Are you realy want to remove this sample? Type "Yes" if you want',
      [
        {
          text: 'OK',
          onPress: () =>
            actions.removeSample(sample, () => navigation.goBack()),
        },
        {text: 'Cancel', onPress: () => {}},
      ],
    );
  };

  if (!sample) {
    return <>Loading</>;
  }

  return (
    <View style={styles.container}>
      <TextInput
        value={String(inAudio)}
        onChangeText={value => setInAudio(value)}
      />
      <TextInput
        value={String(outAudio)}
        onChangeText={value => setOutAudio(value)}
      />
      {trimmedFile && (
        <Text style={{color: colors.text}}>{trimmedFile.duration}</Text>
      )}
      <Button
        title="Play trimmed"
        disabled={!trimmedFile}
        onPress={handleOnPlayTrimmed}
      />

      <View style={[styles.row, {borderColor: colors.border}]}>
        <Text style={[styles.name, {color: colors.text}]}>Sample name:</Text>
        <TextInput
          style={{backgroundColor: colors.card}}
          placeholder="Enter sample name"
          value={values.name}
          onChangeText={text => handleOnInput({name: text})}
        />
      </View>
      <Button onPress={handleTrimAudio} title="Trim Sample" />
      <Button
        color={'red'}
        onPress={() => handleOnRemove(sample)}
        title="Remove Sample"
      />
    </View>
  );
};

export default EditSample;

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
  },
  name: {
    fontWeight: 'bold',
  },
  row: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 12,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
