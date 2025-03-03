import {DefaultTheme, Theme} from '@react-navigation/native';

type Colors = Theme['colors'] & {
  disabled: string;
  disabledText: string;
};

export interface MainThemeInterface extends Theme {
  colors: Colors;
}

const MainTheme: MainThemeInterface = {
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
    disabled: '#494949',
    disabledText: '#d0d0d0',
  },
};

export {MainTheme};
