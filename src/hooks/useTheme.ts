import {useTheme as useReactTheme} from '@react-navigation/native';
import {MainThemeInterface} from '../theme/theme';

export const useTheme = () => useReactTheme() as MainThemeInterface;
