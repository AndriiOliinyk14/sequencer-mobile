import React, {FC, useEffect} from 'react';
import {Button, FlatList, StyleSheet, Text, View} from 'react-native';
import {Sample} from './parts';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useGlobalContext, useSamplesContext} from '../../context';
import {DialogEnum} from '../../types';

const SampleLibrary: FC<{navigation: NativeStackNavigationProp<any>}> = ({
  navigation,
}) => {
  const {
    actions: {openDialog},
  } = useGlobalContext();

  const {actions, state} = useSamplesContext();

  const handleOpenNewSample = () => {
    openDialog(DialogEnum.ADD_RECORD_SAMPLE);
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button title="Add sample" onPress={handleOpenNewSample} />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    actions.getAllSamples();
  }, []);

  console.log('state', state);

  return (
    <View>
      <FlatList
        style={styles.samplesContainer}
        data={state.samples}
        renderItem={item => <Sample name={item.item.name} />}
      />
    </View>
  );
};

export default SampleLibrary;

const styles = StyleSheet.create({
  samplesContainer: {
    paddingHorizontal: 40,
    paddingTop: 40,
  },
});
