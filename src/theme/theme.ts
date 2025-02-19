import {DefaultTheme} from '@react-navigation/native';

const MainTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    background: '#0D0221', // Deep dark blue
    text: '#FF00FF', // Neon pink text
    primary: '#00FFFF', // Cyan highlight (buttons, active elements)
    card: '#1A0730', // Dark purple panels
    border: '#FF0099', // Hot pink accents
    notification: '#FFCC00', // Neon yellow for alerts
  },
};

export {MainTheme};
