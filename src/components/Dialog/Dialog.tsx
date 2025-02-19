import {useTheme} from '@react-navigation/native';
import React, {FC} from 'react';
import {Button, StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';

interface DialogProps {
  isVisible: boolean;
  children: React.ReactNode;
  onClose?: () => void;
}

export const Dialog: FC<DialogProps> = ({isVisible, onClose, children}) => {
  const {colors} = useTheme();

  return (
    <Modal isVisible={isVisible}>
      <View style={[styles.container, {backgroundColor: colors.background}]}>
        <Button title="Close" onPress={onClose} />
        <View style={styles.content}>{children}</View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    width: '100%',
  },
  content: {
    paddingTop: 40,
    flexDirection: 'column',
  },
});
