import {Button, Image, StyleSheet, Text, View} from 'react-native';
import React, {FC} from 'react';
import {useNavigation, useTheme} from '@react-navigation/native';
import {icons} from '../../../../components/icons';
import {SampleEntity, SamplesScreenTypeEnum} from '../../../../types';
import {useGlobalContext, useProjectContext} from '../../../../context';

interface SampleInterface extends SampleEntity {
  type: SamplesScreenTypeEnum;
}

const Sample: FC<SampleInterface> = ({name, id, path, type}) => {
  const {colors} = useTheme();
  const navigation = useNavigation<{
    navigate(name: string, args: {id: string}): unknown;
    goBack(): void;
  }>();

  const {} = useGlobalContext();
  const {actions} = useProjectContext();

  const handleOnEdit = () => {
    navigation.navigate('Edit Sample', {id});
  };

  const handleAddSampleToProject = () => {
    actions.setSample(id, name, path);
    navigation.goBack();
  };

  return (
    <View style={[styles.root, {borderColor: colors.border}]}>
      <Image style={styles.icon} source={icons['hi-hat']} />
      <Text style={[styles.name, {color: colors.text}]}>{name}</Text>
      <View style={styles.buttons}>
        <Button
          title="Edit"
          onPress={handleOnEdit}
          color={colors.notification}
        />
        {type === SamplesScreenTypeEnum.ADD_TO_PROJECT && (
          <Button title="Add to project" onPress={handleAddSampleToProject} />
        )}
      </View>
    </View>
  );
};

export {Sample};

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginVertical: 8,
    width: '45%',
  },
  icon: {
    width: 40,
    height: 40,
    objectFit: 'contain',
  },
  name: {
    paddingTop: 10,
  },
  buttons: {
    paddingTop: 4,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
