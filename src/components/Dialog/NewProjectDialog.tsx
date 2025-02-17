import React, {useState} from 'react';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import {storage} from '../../services/storage';
import {Dialog} from './Dialog';
import {useGlobalContext} from '../../context/globalContext';
import {DialogEnum} from '../../types';
import {useNavigation} from '@react-navigation/native';

export const NewProjectDialog = () => {
  const navigation = useNavigation<any>();
  const {state, actions} = useGlobalContext();
  const {dialogs} = state;

  const [input, setInput] = useState('');
  const [bpm, setBPM] = useState(120);

  const [error, setError] = useState<string | null>(null);

  const handleOnSave = async () => {
    try {
      if (!input) return;

      await storage.saveProject(input, {bpm, patternLength: 16});
      navigation.navigate('Sequencer', {id: input});
      handleOnClose();
    } catch (error) {
      if (typeof error === 'string') {
        setError(error as string);
      }
    }
  };

  const handleOnClose = () => {
    actions.closeDialog(DialogEnum.NEW_PROJECT);
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
            <Text>Name: </Text>
            <TextInput
              placeholder="project name..."
              value={input}
              onChangeText={handleNameOnChange}
            />
          </View>
          <Text style={styles.error}>{error}</Text>
          <View style={styles.inputContainer}>
            <Text>Tempo: </Text>
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
