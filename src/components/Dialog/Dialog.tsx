import React, {FC} from 'react';
import {Button, StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';

interface DialogProps {
  isVisible: boolean;
  children: React.ReactNode;
  onClose?: () => void;
}

export const Dialog: FC<DialogProps> = ({isVisible, onClose, children}) => {
  return (
    <Modal isVisible={isVisible}>
      <View style={styles.container}>
        <Button title="Close" onPress={onClose} />
        <View style={styles.content}>{children}</View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    backgroundColor: '#ffffff',
    height: '80%',
    width: '100%',
    // flex: 1,
  },
  content: {
    paddingTop: 40,
    flexDirection: 'column',
  },
});
