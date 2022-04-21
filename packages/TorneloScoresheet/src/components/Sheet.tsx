import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import IconButton from './IconButton';

/**
 * A Modal for displaying information to the user.
 */

export type SheetProps = {
  visible: boolean;
  title: string;
  content: string;
  dismiss: () => void;
};

const Sheet: React.FC<SheetProps> = ({ visible, content, dismiss, title }) => {
  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      <View style={styles.backdrop}>
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <IconButton
              style={styles.exitButton}
              icon="cancel"
              colour="#4f4f4f"
              onPress={dismiss}
            />
          </View>
          <Text style={styles.content}>{content}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(122, 122, 122, 0.3)',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    backgroundColor: 'white',
    margin: 200,
    borderRadius: 20,
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 40,
    color: 'black',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 400,
  },
  title: {
    paddingLeft: 20,
    fontSize: 30,
    fontWeight: '700',
  },
  exitButton: {
    padding: 20,
  },
});

export default Sheet;
