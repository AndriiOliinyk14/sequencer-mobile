import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import uuid from 'react-native-uuid';
import {useGlobalContext} from '../../context/globalContext';
import {projectStorageService} from '../../services/storage';
import {DialogEnum} from '../../types';
import {TextInput} from '../TextInput';
import {Dialog} from './Dialog';

export const NewProjectDialog = () => {
  const navigation = useNavigation<any>();
  const {state, actions} = useGlobalContext();
  const {dialogs} = state;

  const dialogInfo = dialogs.NEW_PROJECT;

  const [input, setInput] = useState('');
  const [bpm, setBPM] = useState('120');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleOnSave = async () => {
    try {
      if (!input) {
        setErrors(prev => ({
          ...prev,
          projectName: 'Please, enter project name',
        }));

        return;
      }

      if (Number.isNaN(Number(bpm))) {
        setErrors(prev => ({
          ...prev,
          bpm: 'Please, enter correct bpm',
        }));

        return;
      }

      const id = uuid.v4();

      await projectStorageService.createProject({
        id,
        name: input,
        bpm: Number(bpm),
        patternLength: 16,
      });

      navigation.navigate('Sequencer', {id, name: input});
      handleOnClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnClose = () => {
    actions.closeDialog(DialogEnum.NEW_PROJECT);
    dialogInfo.options?.refreshProjectList();
  };

  const handleNameOnChange = (value: string) => {
    setErrors({});
    setInput(value);
  };

  const handleBPMOnChange = (value: string) => {
    setBPM(value);
  };

  return (
    <Dialog
      isVisible={dialogs.NEW_PROJECT.visible}
      onClose={handleOnClose}
      title="Create Project">
      <View style={styles.container}>
        <View style={styles.inputs}>
          <View style={styles.inputContainer}>
            <TextInput
              label="Project Name"
              placeholder="Project 1"
              value={input}
              onChangeText={handleNameOnChange}
            />
          </View>
          <Text style={styles.error}>{errors?.projectName}</Text>
          <View style={styles.inputContainer}>
            <TextInput
              label="Tempo"
              placeholder="BPM"
              value={String(bpm)}
              keyboardType="number-pad"
              onChangeText={handleBPMOnChange}
            />
          </View>
          <Text style={styles.error}>{errors?.bpm}</Text>
        </View>
        <Button title="Create" onPress={handleOnSave} />
      </View>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 20,
  },
  inputs: {
    width: '100%',
    display: 'flex',
    gap: 12,
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  error: {
    padding: 0,
    color: 'red',
  },
});
