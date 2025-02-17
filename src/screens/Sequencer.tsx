import React, {useEffect, useState} from 'react';
import {Button, ScrollView, StyleSheet, View} from 'react-native';
import {Pattern, Transport} from '../components';
import {Indicator} from '../components/Indicator/Indicator';
import {useGlobalContext} from '../context/globalContext';
import {storage} from '../services/storage';
import {DialogEnum} from '../types';

export const Sequencer = ({route}) => {
  const {state, actions} = useGlobalContext();
  const {patterns, samples} = state;

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
  }, [id]);

  const handleAddSample = () => {
    actions.openDialog(DialogEnum.ADD_SAMPLE);
  };

  console.log(patterns);

  return (
    <View style={styles.content}>
      <Transport />

      <Indicator />
      <ScrollView style={{flex: 1, minHeight: 200}}>
        {samples.map(sample => (
          <Pattern
            key={sample.key}
            name={sample.key}
            pattern={patterns[sample.key]}
          />
        ))}
        <Button onPress={handleAddSample} title="Add sample" />
      </ScrollView>
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
  content: {
    paddingTop: 40,
    flexDirection: 'column',
  },
});
