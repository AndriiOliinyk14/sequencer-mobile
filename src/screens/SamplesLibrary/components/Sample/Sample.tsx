import {useNavigation, useTheme} from '@react-navigation/native';
import React, {FC} from 'react';
import {Button, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {Card} from '../../../../components';
import {icons} from '../../../../components/icons';
import {DEFAULT_SAMPLE_SETTINGS} from '../../../../const';
import {useProjectContext} from '../../../../context';
import {playerModule} from '../../../../NativeModules';
import {fsService} from '../../../../services';
import {SampleEntity, SamplesScreenTypeEnum} from '../../../../types';

interface SampleInterface extends SampleEntity {
  type: SamplesScreenTypeEnum;
}

const Sample: FC<SampleInterface> = ({name, id, path, type}) => {
  const {colors} = useTheme();
  const navigation = useNavigation<{
    navigate(name: string, args: {id: string}): unknown;
    goBack(): void;
  }>();

  const {actions} = useProjectContext();

  const handleOnEdit = () => {
    navigation.navigate('Edit Sample', {id});
  };

  const handleAddSampleToProject = () => {
    actions.setSample(id, name, path, DEFAULT_SAMPLE_SETTINGS);
    navigation.goBack();
  };

  const handleOnPlay = async () => {
    const absolutePath = `${fsService.SamplesDirectoryPath}/${path}`;
    await playerModule.load(absolutePath);
    playerModule.play();
  };

  return (
    <Card>
      <Pressable style={[styles.root, {borderColor: colors.border}]}>
        <View style={styles.top}>
          <Image style={styles.icon} source={icons['hi-hat']} />
          <View>
            <Text style={[styles.name, {color: colors.text}]}>
              Name: {name}
            </Text>
            <Text style={[styles.desc, {color: colors.text}]}>
              Duration: 2s
            </Text>
          </View>
        </View>
        <View style={styles.buttons}>
          <Button
            title="Play"
            onPress={handleOnPlay}
            color={colors.notification}
          />
          <Button
            title="Edit"
            onPress={handleOnEdit}
            color={colors.notification}
          />
          {type === SamplesScreenTypeEnum.ADD_TO_PROJECT && (
            <Button title="Add to project" onPress={handleAddSampleToProject} />
          )}
        </View>
      </Pressable>
    </Card>
  );
};

export {Sample};

const styles = StyleSheet.create({
  root: {
    gap: 2,
  },
  top: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  icon: {
    width: 20,
    height: 20,
    objectFit: 'contain',
  },
  name: {fontSize: 14},
  desc: {fontSize: 10},
  buttons: {
    paddingTop: 4,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
