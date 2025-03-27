import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useEffect, useMemo, useState} from 'react';
import {Button, ScrollView, StyleSheet, View} from 'react-native';
import {Card, TextInput} from '../../components';
import {useGlobalContext, useSamplesContext} from '../../context';
import {DialogEnum} from '../../types';
import {Sample} from './components';

const SamplesLibrary: FC<{
  navigation: NativeStackNavigationProp<any>;
  route: any;
}> = ({navigation, route}) => {
  const {
    actions: {openDialog},
  } = useGlobalContext();

  const {actions, state} = useSamplesContext();
  const [search, setSearch] = useState('');

  const handleOpenNewSample = () => {
    openDialog(DialogEnum.ADD_RECORD_SAMPLE, {type: route?.params?.type});
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <Button title="Add" onPress={handleOpenNewSample} />,
    });
  }, [navigation]);

  useEffect(() => {
    actions.getAllSamples();
  }, []);

  const samples = useMemo(() => {
    return search
      ? state.samples.filter(item => {
          console.log(item.name.toLocaleLowerCase());
          return item.name
            .toLocaleLowerCase()
            .includes(search.toLocaleLowerCase().trim());
        })
      : state.samples;
  }, [search, state.samples]);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Card>
          <TextInput
            label="Search"
            placeholder="snare..."
            onChangeText={value => setSearch(value)}
          />
        </Card>
        <View style={styles.samplesContainer}>
          {samples.map(item => (
            <Sample key={item.path} type={route?.params?.type} {...item} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default SamplesLibrary;

const styles = StyleSheet.create({
  container: {paddingTop: 16},
  samplesContainer: {
    paddingTop: 20,
    display: 'flex',
    flex: 1,
    justifyContent: 'space-between',
    gap: 10,
  },
});
