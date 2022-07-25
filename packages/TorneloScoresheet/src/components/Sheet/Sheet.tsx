import React, { useState } from 'react';
import { Modal, View } from 'react-native';
import { useModal } from '../../context/ModalStackContext';
import IconButton from '../IconButton/IconButton';
import PrimaryText, { FontWeight } from '../PrimaryText/PrimaryText';
import { styles } from './style';

/**
 * A Modal for displaying information to the user.
 */

export type SheetProps = {
  visible: boolean;
  title?: string;
  dismiss?: () => void;
};

const Sheet: React.FC<SheetProps> = ({ visible, children, dismiss, title }) => {
  // We want each sheet instance to have a unique ID
  const [uid] = useState<string>(`${Date.now()}+${Math.random()}`);
  // So that it can be uniquely identified in the modal stack
  const { shown } = useModal(uid, visible);

  return (
    <Modal transparent animationType="fade" visible={shown}>
      <View style={styles.backdrop}>
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <PrimaryText size={30} weight={FontWeight.Bold} label={title} />
            {dismiss && (
              <IconButton
                style={styles.exitButton}
                icon="cancel"
                colour="#4f4f4f"
                onPress={dismiss}
              />
            )}
          </View>
          <View style={styles.content}>{children}</View>
        </View>
      </View>
    </Modal>
  );
};

export default Sheet;
