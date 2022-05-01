import React from 'react';
import { Modal, Text, View } from 'react-native';
import IconButton from '../IconButton/IconButton';
import { styles } from './style';

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

export default Sheet;
