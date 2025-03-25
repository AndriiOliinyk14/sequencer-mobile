const icons = {
  kick: {id: 'kick', uri: require('../assets/icons/kick.png')},
  snare: {id: 'snare', uri: require('../assets/icons/snare.png')},
  claps: {id: 'claps', uri: require('../assets/icons/claps.png')},
  crash: {id: 'crash', uri: require('../assets/icons/crash.png')},
  hiHat: {id: 'hiHat', uri: require('../assets/icons/hi-hat.png')},
  openHiHat: {
    id: 'openHiHat',
    uri: require('../assets/icons/open-hi-hat.png'),
  },
  mic: {id: 'mic', uri: require('../assets/icons/mic.png')},
};

const iconsList = Object.values(icons);
export {iconsList, icons};
