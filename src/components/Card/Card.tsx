import React, {FC, ReactNode} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from '../../hooks';

interface CardInterface {
  children: ReactNode;
}

const Card: FC<CardInterface> = ({children}) => {
  const {colors} = useTheme();
  return (
    <View style={[styles.card, {backgroundColor: colors.card}]}>
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
