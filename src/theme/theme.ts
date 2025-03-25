import {DefaultTheme, Theme} from '@react-navigation/native';

type Colors = Theme['colors'] & {
  disabled: string;
  disabledText: string;
  white: string;
  error: string;
  success: string;
  warning: string;
  secondary: string;
};

export interface MainThemeInterface extends Theme {
  colors: Colors;
}

const MainTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    background: '#222831',
    text: '#EEEEEE',
    primary: '#00ADB5',
    card: '#393E46',
    border: '#8CABFF',
    notification: '#FFCC00',
    disabled: '#494949',
    disabledText: '#D0D0D0',
    white: '#EEEEEE',

    secondary: '#007B7F',
    success: '#00C897',
    warning: '#FFA500',
    error: '#D32F2F',
  },
} as MainThemeInterface;

export {MainTheme};
