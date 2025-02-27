import {Link} from '@react-navigation/native';
import React, {useCallback, useEffect} from 'react';
import {Alert, Button, ScrollView, StyleSheet, View} from 'react-native';
import {Pattern, Transport} from '../components';
import {Indicator} from '../components/Indicator/Indicator';
import {useProjectContext} from '../context';
import {useGlobalContext} from '../context/globalContext';
import {projectStorageService} from '../services/storage';
import {PlayerState, SamplesScreenTypeEnum} from '../types';

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

  const handleStopPlaying = () => {
    actions.setPlayerStatus(PlayerState.STOPPED);
  };

  const handleOnSave = useCallback(async () => {
    handleStopPlaying();

    try {
      await projectStorageService.saveProject(id, {
        patterns,
        samples,
        bpm,
        patternLength,
      });

      Alert.alert('Project was saved successfully');
    } catch (error) {
      Alert.alert('Something went wrong :(');
      console.error(error);
    }
  }, [bpm, id, patternLength, patterns, samples]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <Button title="Save" onPress={handleOnSave} />,
    });
  }, [handleOnSave, navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Transport />

        <Indicator />
      </View>

      <ScrollView style={styles.body}>
        {samples.map(sample => {
          return (
            <Pattern
              key={sample.id}
              id={sample.id}
              name={sample.title!}
              pattern={patterns?.[sample?.id]}
            />
          );
        })}
        <Link
          style={styles.addSample}
          screen="Sample Library"
          params={{type: SamplesScreenTypeEnum.ADD_TO_PROJECT}}
          onPress={handleStopPlaying}>
          Add Sample
        </Link>
      </ScrollView>
    </View>
  );
};

export default Sequencer;

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    display: 'flex',
    height: '100%',
    width: '100%',
    flex: 1,
  },
  header: {flexGrow: 0},
  body: {flexGrow: 1},
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
    paddingBottom: 20,
  },
});
