import React, {useCallback, useEffect} from 'react';
import {Button, FlatList, StyleSheet, View} from 'react-native';
import {Pattern, Transport} from '../components';
import {Indicator} from '../components/Indicator/Indicator';
import {useGlobalContext} from '../context/globalContext';
import {storage} from '../services/storage';
import {DialogEnum} from '../types';

export const Sequencer = ({route, navigation}) => {
  const {state, actions} = useGlobalContext();
  const {patterns, samples, bpm, patternLength} = state;

  const {id} = route.params;

  useEffect(() => {
    const fetchData = async () => {
      const project = await storage.getProject(id);

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

  const handleAddSample = () => {
    actions.openDialog(DialogEnum.ADD_SAMPLE, {type: 'ADD_SAMPLE'});
  };

  const handleOnSave = useCallback(async () => {
    console.log('here');
    await storage.saveProject(id, {patterns, samples, bpm, patternLength});
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

      <Button onPress={handleAddSample} title="Add sample" />
    </View>
  );
};

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
});
