import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Card, Player, TextInput} from '../../components';
import {
  useGlobalContext,
  useProjectContext,
  useSamplesContext,
} from '../../context';
import {useTheme} from '../../hooks';
import {fsService, sampleStorageService} from '../../services';
import {DialogEnum, SampleEntity} from '../../types';

const EditSample = () => {
  const {colors} = useTheme();
  const navigation = useNavigation();

  const route = useRoute<{key: string; params: {id: string}; name: string}>();

  const [sample, setSample] = useState<SampleEntity>();
  const [trimmedPath, setTrimmedPath] = useState<string | null>(null);
  const [values, setValues] = useState<{name: string}>({name: ''});

  const {actions} = useSamplesContext();
  const {state: projectState, actions: projectActions} = useProjectContext();
  const {
    actions: {openDialog},
  } = useGlobalContext();

  const fetchSample = async () => {
    const data = await sampleStorageService.get(route.params.id);

    if (!data) return;

    setValues({name: data.name});
    setSample(data);
  };

  useEffect(() => {
    fetchSample();
  }, []);

  const handleOnChangeIcon = (id: string) => {
    setSample(prev => {
      if (prev && id) {
        return {...prev, icon: id};
      }
    });
  };

  const handleOpenLibraryDialog = () => {
    openDialog(DialogEnum.ICONS_LIBRARY, {onChange: handleOnChangeIcon});
  };

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

      await sampleStorageService.update(data);

      actions.getAllSamples();

      if (projectState.samples[data.id]) {
        const sampleToUpdate = {
          ...data,
          settings: projectState.samples[data.id].settings,
        };
        console.log(sampleToUpdate);
        projectActions.reloadSample(sampleToUpdate);
      }

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
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.content}>
          <Card>
            <Player path={absolutePath} onTrim={data => setTrimmedPath(data)} />
          </Card>
          <Card style={styles.row}>
            <Text style={{color: colors.text}}>Icon: </Text>
            {sample?.icon && (
              <Image style={styles.icon} source={sample.icon as any} />
            )}
            <Button
              title={sample.icon ? 'Change icon' : 'Add icon'}
              onPress={handleOpenLibraryDialog}
            />
          </Card>
          <Card>
            <TextInput
              label="Sample name"
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
    </ScrollView>
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
  content: {
    gap: 10,
  },
  name: {
    fontWeight: 'bold',
  },
  icon: {
    width: 30,
    height: 30,
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
