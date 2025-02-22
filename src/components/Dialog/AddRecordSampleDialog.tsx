import React from 'react';
import {Button, StyleSheet} from 'react-native';
import {useGlobalContext, useSamplesContext} from '../../context';
import {DialogEnum} from '../../types';
import {Dialog} from './Dialog';

import {pick, types} from '@react-native-documents/picker';

const AddRecordSampleDialog = () => {
  const {
    actions: {closeDialog},
    state: {dialogs},
  } = useGlobalContext();

  const {actions} = useSamplesContext();

  const handleOnClose = () => {
    closeDialog(DialogEnum.ADD_RECORD_SAMPLE);
  };

  const handleOnImportAudio = async () => {
    const files = await pick({type: types.audio});

    if (!files?.[0] || files[0].error) return;

    const file = files[0];

    const formatedFileUri = file.uri.replace('file://', '');

    if (file?.name) {
      const [name, format] = file.name.split('.');
      actions.importSample(name, format, formatedFileUri);
    }
  };

  return (
    <Dialog
      isVisible={dialogs.ADD_RECORD_SAMPLE.visible}
      onClose={handleOnClose}>
      <Button title="Import audio" onPress={handleOnImportAudio} />
    </Dialog>
  );
};

export {AddRecordSampleDialog};

const styles = StyleSheet.create({});
