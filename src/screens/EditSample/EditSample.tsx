import {useNavigation, useRoute, useTheme} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Alert, Button, StyleSheet, Text, View} from 'react-native';
import {Card, Player, TextInput} from '../../components';
import {useSamplesContext} from '../../context';
import {fsService, sampleStorageService} from '../../services';
import {SampleEntity} from '../../types';

const EditSample = () => {
  const {colors} = useTheme();
  const navigation = useNavigation();

  const route = useRoute<{key: string; params: {id: string}; name: string}>();

  const [sample, setSample] = useState<SampleEntity>();
  const [trimmedPath, setTrimmedPath] = useState<string | null>(null);
  const [values, setValues] = useState<{name: string}>({name: ''});

  const {actions} = useSamplesContext();

  const fetchSample = async () => {
    const data = await sampleStorageService.get(route.params.id);

    if (!data) return;

    setValues({name: data.name});
    setSample(data);
  };

  useEffect(() => {
    fetchSample();
  }, []);

  const handleOnSaveTrimmed = async () => {
    if (sample && trimmedPath) {
      await actions.updateSample(sample?.id, sample?.name, trimmedPath);
      await fetchSample();
    }
  };

  const handleOnSave = async (
    sample: SampleEntity,
    values: Partial<SampleEntity>,
  ) => {
    try {
      await handleOnSaveTrimmed();

      const data = {...sample, ...values};
      console.log('data: ', data);
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

  const absolutePath = `${fsService.SamplesDirectoryPath}/${sample.path}`;

  return (
    <View style={styles.container}>
      <View>
        <Player path={absolutePath} onTrim={data => setTrimmedPath(data)} />
        <Card>
          <TextInput
            label="Sample name:"
            style={{backgroundColor: colors.card}}
            placeholder="Enter sample name"
            value={values.name}
            onChangeText={text => handleOnInput({name: text})}
          />
        </Card>
      </View>
      <View style={styles.bottom}>
        <Button title="Save" onPress={() => handleOnSave(sample, values)} />
        <Button
          color={'red'}
          onPress={() => handleOnRemove(sample)}
          title="Remove Sample"
        />
      </View>
    </View>
  );
};

export default EditSample;

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    display: 'flex',
    justifyContent: 'space-between',
    height: '100%',
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
  bottom: {
    display: 'flex',
    flexDirection: 'row',
    gap: 40,
    justifyContent: 'center',
  },
});
