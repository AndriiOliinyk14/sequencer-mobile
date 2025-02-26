import {useNavigation, useRoute, useTheme} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {TextInput} from '../../components';
import {useSamplesContext} from '../../context';
import {sampleStorageService} from '../../services';
import {SampleEntity} from '../../types';

const EditSample = () => {
  const {colors} = useTheme();
  const navigation = useNavigation();

  const route = useRoute<{key: string; params: {id: string}; name: string}>();

  const [sample, setSample] = useState<SampleEntity>();
  const [values, setValues] = useState<{name: string}>({name: ''});

  const {
    actions,
    state: {samples},
  } = useSamplesContext();

  useEffect(() => {
    const fetchSample = async () => {
      const data = await sampleStorageService.get(route.params.id);
      console.log('data', data);

      if (!data) return;

      setValues({name: data.name});
      setSample(data);
    };
    fetchSample();
  }, []);

  const handleOnSave = async (
    sample: SampleEntity,
    values: Partial<SampleEntity>,
  ) => {
    try {
      const data = {...sample, ...values};
      await sampleStorageService.update(data);
      actions.getAllSamples();
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
    });
  }, [navigation, sample, values]);

  const handleOnInput = (value: {[key: string]: string}) => {
    setValues(state => ({...state, ...value}));
  };

  return (
    <View style={styles.rows}>
      <View style={[styles.row, {borderColor: colors.border}]}>
        <Text style={[styles.name, {color: colors.text}]}>Sample name:</Text>
        <TextInput
          style={{backgroundColor: colors.card}}
          placeholder="Enter sample name"
          value={values.name}
          onChangeText={text => handleOnInput({name: text})}
        />
      </View>
    </View>
  );
};

export default EditSample;

const styles = StyleSheet.create({
  rows: {
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
