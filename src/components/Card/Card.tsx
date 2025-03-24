import React, {FC, ReactNode} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {useTheme} from '../../hooks';

interface CardInterface {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const Card: FC<CardInterface> = ({children, style = {}}) => {
  const {colors} = useTheme();
  return (
    <View style={[styles.card, {backgroundColor: colors.card}, style]}>
      {children}
    </View>
  );
};

export {Card};

const styles = StyleSheet.create({
  card: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    borderRadius: 4,
  },
});
