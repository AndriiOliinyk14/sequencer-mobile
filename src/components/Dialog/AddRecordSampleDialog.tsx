import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useGlobalContext, useSamplesContext} from '../../context';
import {DialogEnum} from '../../types';
import {Dialog} from './Dialog';

import {pick, types} from '@react-native-documents/picker';
import {useNavigation, useTheme} from '@react-navigation/native';
import {Button} from '../Button';

const AddRecordSampleDialog = () => {
  const [file, setFile] = useState<{
    name: string;
    format: string;
    uri: string;
  }>();

  const {
    actions: {closeDialog},
    state: {dialogs},
  } = useGlobalContext();
  const {colors} = useTheme();
  const navigation = useNavigation<any>();

  const {actions} = useSamplesContext();

  const handleOnClose = () => {
    setFile(undefined);
    closeDialog(DialogEnum.ADD_RECORD_SAMPLE);
  };

  const handleOnImportAudio = async () => {
    const files = await pick({type: types.audio});

    if (!files?.[0] || files[0].error) return;

    const file = files[0];

    const formatedFileUri = file.uri.replace('file://', '');

    if (file?.name) {
      const [name, format] = file.name.split('.');
      setFile({name, format, uri: formatedFileUri});
    }
  };

  const handleOnImport = () => {
    if (!file) return;

    actions.importSample(file?.name, file?.format, file?.uri, id =>
      navigation.navigate('Samples Library', {
        type: dialogs.ADD_RECORD_SAMPLE?.options?.type,
      }),
    );

    handleOnClose();
  };

  const handleOnRecord = () => {
    navigation.navigate('Record');
    handleOnClose();
  };

  return (
    <Dialog
      isVisible={dialogs.ADD_RECORD_SAMPLE.visible}
      onClose={handleOnClose}>
      <View style={styles.container}>
        {!file ? (
          <View style={styles.buttons}>
            <Button onPress={handleOnImportAudio} color={colors.notification}>
              Import file
            </Button>
            <Button onPress={handleOnRecord}>Record audio</Button>
          </View>
        ) : (
          <View style={styles.file}>
            <Text style={{color: colors.text}}>File name: {file?.name}</Text>
            <Button onPress={handleOnImport}>Import sample to library</Button>
          </View>
        )}
      </View>
    </Dialog>
  );
};

export {AddRecordSampleDialog};

const styles = StyleSheet.create({
  container: {},
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  importButton: {
    paddingHorizontal: 8,
    borderRadius: 4,
    paddingVertical: 4,
  },
  file: {
    alignItems: 'center',
  },
});
