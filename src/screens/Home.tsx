import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useEffect, useState} from 'react';
import {Button, FlatList, StyleSheet, Text, View} from 'react-native';
import {useGlobalContext} from '../context/globalContext';
import {storage} from '../services/storage';
import {DialogEnum} from '../types';

export const Home: FC<{navigation: NativeStackNavigationProp<any>}> = ({
  navigation,
}) => {
  const {actions} = useGlobalContext();

  const [projects, setProjects] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const projectNames = await storage.getProjectNames();
      if (projectNames?.length) {
        setProjects(projectNames.splice(0, 5));
      }
    })();
  }, []);

  const handleOpenNewProjectDialog = () => {
    actions.openDialog(DialogEnum.NEW_PROJECT);
  };

  const handleOpenProject = id => {
    navigation.navigate('Sequencer', {id});
  };

  return (
    <View style={styles.container}>
      <Button onPress={handleOpenNewProjectDialog} title="New Project" />

      <View style={{paddingTop: 100}}>
        <Text>Recent Projects:</Text>
        <FlatList
          data={projects}
          renderItem={({item}) => (
            <Button onPress={() => handleOpenProject(item)} title={item} />
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 40,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  projectButton: {
    backgroundColor: '#717895',
    paddingHorizontal: 12,
    marginBottom: 4,
  },
});
