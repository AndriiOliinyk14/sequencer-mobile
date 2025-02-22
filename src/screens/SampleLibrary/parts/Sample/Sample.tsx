import {Button, Image, StyleSheet, Text, View} from 'react-native';
import React, {FC} from 'react';
import {useTheme} from '@react-navigation/native';
import {icons} from '../../../../components/icons';

interface SampleInterface {
  name: string;
}

const Sample: FC<SampleInterface> = ({name}) => {
  const {colors} = useTheme();
  return (
    <View style={[styles.root, {borderColor: colors.border}]}>
      <Image style={styles.icon} source={icons['hi-hat']} />
      <Text style={{color: colors.text}}>{name}</Text>
      <Button title="Edit" />
    </View>
  );
};

export {Sample};

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginVertical: 8,
  },
  icon: {
    width: 40,
    height: 40,
    objectFit: 'contain',
  },
});
