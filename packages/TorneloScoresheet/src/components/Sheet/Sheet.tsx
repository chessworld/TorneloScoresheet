import React from 'react';
import { Modal, View } from 'react-native';
import IconButton from '../IconButton/IconButton';
import PrimaryText, { FontWeight } from '../PrimaryText/PrimaryText';
import { styles } from './style';

/**
 * A Modal for displaying information to the user.
 */

export type SheetProps = {
  visible: boolean;
  title?: string;
  dismiss: () => void;
};

const Sheet: React.FC<SheetProps> = ({ visible, children, dismiss, title }) => {
  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      <View style={styles.backdrop}>
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <PrimaryText
              size={30}
              weight={FontWeight.Bold}
              style={styles.title}
              label={title}
            />
            <IconButton
              style={styles.exitButton}
              icon="cancel"
              colour="#4f4f4f"
              onPress={dismiss}
            />
          </View>
          <View style={styles.content}>{children}</View>
        </View>
      </View>
    </Modal>
  );
};

export default Sheet;
