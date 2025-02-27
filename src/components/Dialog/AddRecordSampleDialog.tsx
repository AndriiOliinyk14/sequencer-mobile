import React, {useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {useGlobalContext, useSamplesContext} from '../../context';
import {DialogEnum} from '../../types';
import {Dialog} from './Dialog';

import {pick, types} from '@react-native-documents/picker';
import {useNavigation, useTheme} from '@react-navigation/native';

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
  const {navigate} = useNavigation();

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

    actions.importSample(file?.name, file?.format, file?.uri, navigate);
    handleOnClose();
  };

  return (
    <Dialog
      isVisible={dialogs.ADD_RECORD_SAMPLE.visible}
      onClose={handleOnClose}>
      {!file ? (
        <Button
          title="Choice file"
          onPress={handleOnImportAudio}
          color="white"
        />
      ) : (
        <View style={styles.file}>
          <Text style={{color: colors.text}}>{file?.name}</Text>
          <Button title="Import sample" onPress={handleOnImport} />
        </View>
      )}
    </Dialog>
  );
};

export {AddRecordSampleDialog};

const styles = StyleSheet.create({
  file: {
    alignItems: 'center',
  },
});
