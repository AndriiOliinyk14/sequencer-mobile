import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {useGlobalContext} from '../context/globalContext';

const Samples = () => {
  const {state, actions} = useGlobalContext();
  const {samples, dialogs} = state;

  return (
    <View>
      <Text style={{color: 'white'}}>tetss</Text>
    </View>
  );
};

export default Samples;

const styles = StyleSheet.create({});
