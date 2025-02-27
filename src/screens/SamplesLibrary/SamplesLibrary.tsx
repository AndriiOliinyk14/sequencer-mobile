import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useEffect} from 'react';
import {Button, ScrollView, StyleSheet, View} from 'react-native';
import {useGlobalContext, useSamplesContext} from '../../context';
import {DialogEnum} from '../../types';
import {Sample} from './components';

const SamplesLibrary: FC<{
  navigation: NativeStackNavigationProp<any>;
  route: any;
}> = ({navigation, route}) => {
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

  return (
    <View>
      <ScrollView>
        <View style={styles.samplesContainer}>
          {state.samples.map(item => (
            <Sample key={item.path} type={route.params.type} {...item} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default SamplesLibrary;

const styles = StyleSheet.create({
  samplesContainer: {
    paddingHorizontal: 40,
    paddingTop: 40,
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
});
