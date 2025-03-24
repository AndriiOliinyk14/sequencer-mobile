import React, {useMemo} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useGlobalContext} from '../../context';
import {Card} from '../Card';
import {icons} from '../icons';
import {Dialog} from './Dialog';

const IconsLibrary = () => {
  const {
    state: {dialogs},
  } = useGlobalContext();

  const iconsList = useMemo(() => {
    return Object.values(icons);
  }, []);

  return (
    <Dialog isVisible={dialogs.ICONS_LIBRARY.visible} title="Icons Library">
      <View style={styles.root}>
        <Card style={styles.content}>
          {iconsList.map(icon => (
            <TouchableOpacity style={styles.iconButton}>
              <Image style={styles.icon} source={icon as any} />
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
