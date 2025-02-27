import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useEffect, useState} from 'react';
import {Alert, Button, FlatList, StyleSheet, Text, View} from 'react-native';
import {useGlobalContext} from '../context/globalContext';
import {projectStorageService} from '../services/storage';
import {DialogEnum, Project, SamplesScreenTypeEnum} from '../types';
import {Link, useTheme} from '@react-navigation/native';

const Home: FC<{navigation: NativeStackNavigationProp<any>}> = ({
  navigation,
}) => {
  const {colors} = useTheme();
  const {state, actions} = useGlobalContext();

  const [projects, setProjects] = useState<Project[]>([]);

  const fetchProjects = async () => {
    const projectNames = await projectStorageService.getAllProjects();

    if (projectNames?.length) {
      setProjects(projectNames);
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

  const handleOpenProject = (id: string, name: string) => {
    navigation.navigate('Sequencer', {id, name});
  };

  const handleRemoveProject = async id => {
    Alert.alert('Remove Project', 'Do you realy want to remove the project?', [
      {
        text: 'OK',
        onPress: async () => {
          await projectStorageService.deleteProject(id);
          fetchProjects();
        },
      },
      {
        text: 'Cancel',
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Button onPress={handleOpenNewProjectDialog} title="Create Project" />

      <Link
        screen="Samples Library"
        params={{type: SamplesScreenTypeEnum.DEFAULT}}>
        Samples Library
      </Link>

      <View style={{paddingTop: 100}}>
        <Text style={{color: colors.text}}>Recent Projects:</Text>
        <FlatList
          data={projects}
          renderItem={({item}) => (
            <View style={styles.buttonsWrapper}>
              <Button
                onPress={() => handleOpenProject(item.id, item.name)}
                title={item.name || ''}
              />
              <Button
                onPress={() => handleRemoveProject(item.id)}
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
