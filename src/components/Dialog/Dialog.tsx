import React, {FC} from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import Modal from 'react-native-modal';
import {useTheme} from '../../hooks';

interface DialogProps {
  isVisible: boolean;
  children: React.ReactNode;
  title?: string;
  onClose?: () => void;
}

export const Dialog: FC<DialogProps> = ({
  isVisible,
  onClose,
  title,
  children,
}) => {
  const {colors} = useTheme();

  return (
    <Modal isVisible={isVisible}>
      <View style={[styles.header, {backgroundColor: colors.text}]}>
        <TouchableHighlight onPress={onClose} style={styles.close}>
          <>
            3
            <View
              style={[
                styles.crossline1,
                {backgroundColor: colors.disabledText},
              ]}
            />
            <View
              style={[
                styles.crossline2,
                {backgroundColor: colors.disabledText},
              ]}
            />
          </>
        </TouchableHighlight>
        {title && (
          <Text style={[styles.title, {color: colors.primary}]}>{title}</Text>
        )}
      </View>
      <View style={[styles.container, {backgroundColor: colors.background}]}>
        <View style={styles.content}>{children}</View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    width: '100%',
    paddingVertical: 24,
  },
  header: {
    paddingVertical: 10,
    position: 'relative',
  },
  content: {
    paddingVertical: 10,
    flexDirection: 'column',
  },
  title: {
    fontSize: 14,
    fontWeight: 700,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  close: {position: 'absolute', right: 0, top: 18, width: 40, height: 40},
  crossline1: {
    width: 20,
    height: 3,
    position: 'absolute',
    transform: 'rotate(45deg)',
  },
  crossline2: {
    width: 20,
    height: 3,
    position: 'absolute',
    transform: 'rotate(-45deg)',
  },
});
