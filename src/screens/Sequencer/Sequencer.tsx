import {Link} from '@react-navigation/native';
import React, {useCallback, useEffect} from 'react';
import {Alert, Button, ScrollView, StyleSheet, View} from 'react-native';
import {Transport} from '../../components';
import {Indicator} from '../../components/Indicator/Indicator';
import {useProjectContext} from '../../context';
import {useGlobalContext} from '../../context/globalContext';
import {projectStorageService} from '../../services/storage';
import {PlayerState, SamplesScreenTypeEnum} from '../../types';
import {Pattern} from './components';

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

      if (!project) return;

      actions.setProject(project);
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
        name: state.name,
        id: state.id,
        createdAt: state.createdAt,
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
  }, [
    bpm,
    id,
    patternLength,
    patterns,
    samples,
    state.createdAt,
    state.id,
    state.name,
  ]);

  useEffect(() => {
    navigation.setOptions({
      title: state.name,
      headerRight: () => <Button title="Save" onPress={handleOnSave} />,
    });
  }, [handleOnSave, navigation, state.name]);

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
              name={sample.name}
              pattern={patterns?.[sample?.id]}
            />
          );
        })}
        <Link
          style={styles.addSample}
          screen="Samples Library"
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
