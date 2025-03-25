import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useGlobalContext} from '../../context';
import {DialogEnum} from '../../types';
import {Card} from '../Card';
import {iconsList} from '../icons';
import {Dialog} from './Dialog';

const IconsLibrary = () => {
  const {
    actions: {closeDialog},
    state: {dialogs},
  } = useGlobalContext();

  const iconsLibraryInfo = dialogs.ICONS_LIBRARY;

  const handleOnClose = () => {
    closeDialog(DialogEnum.ICONS_LIBRARY);
  };

  const handleOnPress = (id: string) => {
    iconsLibraryInfo.options.onChange(id);
    handleOnClose();
  };

  return (
    <Dialog
      isVisible={iconsLibraryInfo.visible}
      title="Icons Library"
      onClose={handleOnClose}>
      <View style={styles.root}>
        <Card style={styles.content}>
          {iconsList.map(icon => (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => handleOnPress(icon.uri)}>
              <Image style={styles.icon} source={icon.uri} />
            </TouchableOpacity>
          ))}
        </Card>
      </View>
    </Dialog>
  );
};

export {IconsLibrary};

const styles = StyleSheet.create({
  root: {
    gap: 12,
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    gap: 16,
  },
  iconButton: {},
  icon: {
    width: 36,
    height: 36,
  },
});
