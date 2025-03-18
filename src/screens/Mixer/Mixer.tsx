import {ScrollView, StyleSheet, View} from 'react-native';

import React, {memo} from 'react';
import {Transport} from '../../components';
import {useProjectContext} from '../../context';
import ChannelStrip from './components/ChannelStrip/ChannelStrip';

const Mixer = memo(() => {
  const {
    state: {samples, sampleIds},
  } = useProjectContext();

  return (
    <View style={styles.container}>
      <Transport />

      <ScrollView horizontal contentContainerStyle={styles.channelStips}>
        {sampleIds.map(id => {
          const sample = samples[id];

          return <ChannelStrip key={`strip_${sample.id}`} data={sample} />;
        })}
      </ScrollView>
    </View>
  );
});

export default Mixer;

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    gap: 10,
  },
  channelStips: {
    paddingHorizontal: 20,
    display: 'flex',
    // flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'space-between',
    gap: 10,
  },
});
