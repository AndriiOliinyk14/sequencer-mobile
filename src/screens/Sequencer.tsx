import React, {useCallback, useEffect} from 'react';
import {Button, FlatList, ScrollView, StyleSheet, View} from 'react-native';
import {Pattern, Transport} from '../components';
import {Indicator} from '../components/Indicator/Indicator';
import {useProjectContext} from '../context';
import {useGlobalContext} from '../context/globalContext';
import {projectStorageService} from '../services/storage';
import {DialogEnum, SamplesScreenTypeEnum} from '../types';
import {Link} from '@react-navigation/native';

const Sequencer = ({route, navigation}) => {
  const {
    actions: {openDialog},
  } = useGlobalContext();
  const {state, actions} = useProjectContext();
  const {patterns, samples, bpm, patternLength} = state;

  const {id} = route.params;

  useEffect(() => {
    const fetchData = async () => {
      const project = await projectStorageService.getProject(id);

      actions.setInitialProject(
        project.patterns,
        project.samples,
        project.bpm,
        project.patternLength,
      );
    };

    fetchData();

    return () => {
      return actions.resetState();
    };
  }, [id]);

  console.log(samples, patterns);

  const handleOnSave = useCallback(async () => {
    await projectStorageService.saveProject(id, {
      patterns,
      samples,
      bpm,
      patternLength,
    });
  }, [bpm, id, patternLength, patterns, samples]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <Button title="Save" onPress={handleOnSave} />,
    });
  }, [handleOnSave, navigation]);

  return (
    <View style={styles.content}>
      <Transport />

      <Indicator />

      <FlatList
        data={samples}
        renderItem={({item}) => {
          return (
            <Pattern
              key={item.key}
              id={item.key}
              name={item.title!}
              pattern={patterns?.[item?.key]}
            />
          );
        }}
      />

      <Link
        style={styles.addSample}
        screen="Sample Library"
        params={{type: SamplesScreenTypeEnum.ADD_TO_PROJECT}}>
        Add Sample
      </Link>
    </View>
  );
};

export default Sequencer;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    backgroundColor: '#ffffff',
    height: '100%',
    width: '100%',
    flex: 1,
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  content: {
    paddingTop: 40,
    flexDirection: 'column',
  },
  addSample: {
    textAlign: 'center',
  },
});
