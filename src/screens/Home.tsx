import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useEffect, useState} from 'react';
import {Button, FlatList, StyleSheet, Text, View} from 'react-native';
import {useGlobalContext} from '../context/globalContext';
import {projectStorageService} from '../services/storage';
import {DialogEnum, SamplesScreenTypeEnum} from '../types';
import {Link, useTheme} from '@react-navigation/native';

const Home: FC<{navigation: NativeStackNavigationProp<any>}> = ({
  navigation,
}) => {
  const {colors} = useTheme();
  const {actions} = useGlobalContext();

  const [projects, setProjects] = useState<string[]>([]);

  const fetchProjects = async () => {
    const projectNames = await projectStorageService.getProjectNames();
    if (projectNames?.length) {
      setProjects(projectNames.splice(0, 10));
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenNewProjectDialog = () => {
    actions.openDialog(DialogEnum.NEW_PROJECT, {
      refreshProjectList: fetchProjects,
    });
  };

  const handleOpenProject = id => {
    navigation.navigate('Sequencer', {id});
  };

  const handleRemoveProject = async id => {
    await projectStorageService.deleteProject(id);
    fetchProjects();
  };

  return (
    <View style={styles.container}>
      <Button onPress={handleOpenNewProjectDialog} title="Create Project" />

      <Link screen="Sample Library" params={{type: SamplesScreenTypeEnum.DEFAULT}}>
        Samples Library
      </Link>

      <View style={{paddingTop: 100}}>
        <Text style={{color: colors.text}}>Recent Projects:</Text>
        <FlatList
          data={projects}
          renderItem={({item}) => (
            <View style={styles.buttonsWrapper}>
              <Button onPress={() => handleOpenProject(item)} title={item} />
              <Button
                onPress={() => handleRemoveProject(item)}
                title={'Delete'}
                color={'red'}
              />
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 40,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  buttonsWrapper: {
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
