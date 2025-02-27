import {useNavigation, useTheme} from '@react-navigation/native';
import React, {useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import uuid from 'react-native-uuid';
import {useGlobalContext} from '../../context/globalContext';
import {projectStorageService} from '../../services/storage';
import {DialogEnum} from '../../types';
import {TextInput} from '../TextInput';
import {Dialog} from './Dialog';

export const NewProjectDialog = () => {
  const {colors} = useTheme();
  const navigation = useNavigation<any>();
  const {state, actions} = useGlobalContext();
  const {dialogs} = state;

  const dialogInfo = dialogs.NEW_PROJECT;

  const [input, setInput] = useState('');
  const [bpm, setBPM] = useState(120);

  const [error, setError] = useState<string | null>(null);

  const handleOnSave = async () => {
    try {
      if (!input) return;

      const id = uuid.v4();

      await projectStorageService.createProject({
        id,
        name: input,
        bpm,
        patternLength: 16,
      });
      navigation.navigate('Sequencer', {id, name: input});
      handleOnClose();
    } catch (error) {
      if (typeof error === 'string') {
        setError(error as string);
      }
    }
  };

  const handleOnClose = () => {
    actions.closeDialog(DialogEnum.NEW_PROJECT);
    dialogInfo.options?.refreshProjectList();
  };

  const handleNameOnChange = (value: string) => {
    setError(null);
    setInput(value);
  };

  const handleBPMOnChange = (value: string) => {
    const numberValue = parseInt(value, 10);
    setBPM(numberValue);
  };

  return (
    <Dialog isVisible={dialogs.NEW_PROJECT.visible} onClose={handleOnClose}>
      <View style={styles.container}>
        <View style={styles.inputs}>
          <View style={styles.inputContainer}>
            <Text style={{color: colors.text, fontWeight: 'bold'}}>Name: </Text>
            <TextInput
              placeholder="project name..."
              value={input}
              onChangeText={handleNameOnChange}
            />
          </View>
          <Text style={styles.error}>{error}</Text>
          <View style={styles.inputContainer}>
            <Text style={{color: colors.text, fontWeight: 'bold'}}>
              Tempo:{' '}
            </Text>
            <TextInput
              placeholder="BPM"
              value={String(bpm)}
              keyboardType="number-pad"
              onChangeText={handleBPMOnChange}
            />
          </View>
        </View>
        <Button title="Create project" onPress={handleOnSave} />
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
