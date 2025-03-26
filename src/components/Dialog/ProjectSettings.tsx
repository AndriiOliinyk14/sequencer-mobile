import React, {useEffect, useState} from 'react';
import {Alert, Button, StyleSheet, View} from 'react-native';
import {useGlobalContext, useProjectContext} from '../../context';
import {DialogEnum} from '../../types';
import {TextInput} from '../TextInput';
import {Dialog} from './Dialog';
import {projectStorageService} from '../../services';

const ProjectSettings = () => {
  const {
    state: {dialogs},
    actions: {closeDialog},
  } = useGlobalContext();
  const {state, actions: projectActions} = useProjectContext();

  const [projectSettings, setProjectSettings] = useState<{
    name: string;
    bpm: string;
  }>({
    name: state.name,
    bpm: state.bpm.toString(),
  });

  useEffect(() => {
    setProjectSettings({name: state.name, bpm: state.bpm.toString()});
  }, [state.bpm, state.name]);

  const dialogInfo = dialogs.PROJECT_SETTINGS;

  const handleOnClose = () => closeDialog(DialogEnum.PROJECT_SETTINGS);

  const handleOnChangeName = (value: string) => {
    setProjectSettings(prev => ({...prev, name: value}));
  };
  const handleOnChangeBpm = (value: string) => {
    setProjectSettings(prev => ({...prev, bpm: value}));
  };

  const handleOnSave = async () => {
    try {
      await projectStorageService.saveProject(state.id, {
        name: projectSettings.name,
        id: state.id,
        createdAt: state.createdAt,
        patterns: state.patterns,
        sampleIds: state.sampleIds,
        samples: state.samples,
        bpm: Number(projectSettings.bpm),
        patternLength: state.patternLength,
      });

      Alert.alert('Project was saved successfully');

      const project = await projectStorageService.getProject(state.id);

      if (!project) return;
      projectActions.setProject(project);

      handleOnClose();
    } catch (error) {
      Alert.alert('Something went wrong :(');
      console.error(error);
    }
  };

  return (
    <Dialog
      isVisible={dialogInfo.visible}
      title="Project settings"
      onClose={handleOnClose}>
      <View style={styles.container}>
        <TextInput
          label="Project Name"
          value={projectSettings.name}
          onChangeText={handleOnChangeName}
        />
        <TextInput
          label="BPM"
          value={projectSettings.bpm}
          onChangeText={handleOnChangeBpm}
        />
        <Button onPress={handleOnSave} title="Save" />
      </View>
    </Dialog>
  );
};

export {ProjectSettings};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
});
