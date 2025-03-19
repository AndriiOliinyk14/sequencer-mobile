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

      <View>
        <ScrollView horizontal contentContainerStyle={styles.channelStips}>
          {sampleIds.map(id => {
            const sample = samples[id];

            return <ChannelStrip key={`strip_${sample.id}`} data={sample} />;
          })}
        </ScrollView>
      </View>
    </View>
  );
});

export default Mixer;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingBottom: 40,
    height: '100%',
  },
  channelStips: {
    paddingHorizontal: 20,
    gap: 10,
  },
});
