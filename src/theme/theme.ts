import {DefaultTheme, Theme} from '@react-navigation/native';

type Colors = Theme['colors'] & {
  disabled: string;
  disabledText: string;
  red: string;
};

export interface MainThemeInterface extends Theme {
  colors: Colors;
}

const MainTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    background: '#0D0221',
    text: '#FF00FF',
    primary: '#00FFFF',
    card: '#1A0730',
    border: '#FF0099',
    notification: '#FFCC00',
    disabled: '#494949',
    disabledText: '#d0d0d0',
    red: '#f22424',
  },
} as MainThemeInterface;

export {MainTheme};
