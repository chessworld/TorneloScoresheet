import React from 'react';
import { Modal, View } from 'react-native';
import { colours } from '../../style/colour';
import IconButton from '../IconButton/IconButton';
import PrimaryText, { FontWeight } from '../PrimaryText/PrimaryText';
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
          <PrimaryText
            colour={colours.black}
            style={styles.content}
            label={content}
          />
        </View>
      </View>
    </Modal>
  );
};

export default Sheet;
