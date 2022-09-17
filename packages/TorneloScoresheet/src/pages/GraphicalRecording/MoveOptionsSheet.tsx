import React, { useState } from 'react';
import Sheet from '../../components/Sheet/Sheet';
import { colours } from '../../style/colour';
import { ICON_CLOCK, ICON_HALF } from '../../style/images';
import { PlayerColour } from '../../types/ChessGameInfo';
import MoveOption from './MoveOption';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useRecordingState } from '../../context/AppModeStateContext';
import OptionSheet from '../../components/OptionSheet/OptionSheet';
import {
  ReversibleAction,
  ReversibleActionType,
} from '../../types/ReversibleAction';

export type EditingMove = {
  colour: PlayerColour;
  moveIndex: number;
};

type MoveOptionsSheetProps = {
  editingMove: EditingMove | undefined;
  handleGameTime: (index: number) => void;
  dismiss: () => void;
  pushUndoAction: (action: ReversibleAction) => void;
};

const MoveOptionsSheet = ({
  editingMove,
  handleGameTime,
  dismiss,
  pushUndoAction,
}: MoveOptionsSheetProps) => {
  const recordingState = useRecordingState();
  const [displaySkipMoves, setDisplaySkipMoves] = useState(false);
  const toggleDraw = recordingState?.toggleDraw;
  const goToEditMove = recordingState?.goToEditMove;

  const handleDrawOffer = () => {
    if (!toggleDraw || !editingMove) {
      return;
    }
    const indexOfPlyInHistory =
      editingMove.moveIndex * 2 +
      (editingMove.colour === PlayerColour.Black ? 1 : 0);
    pushUndoAction({
      type: ReversibleActionType.ToggleDrawOffer,
      indexOfPlyInHistory,
    });
    toggleDraw(indexOfPlyInHistory);
    dismiss();
  };
  const handleConfirmSkips = () => {
    setDisplaySkipMoves(false);
    if (editingMove) {
      goToEditMove?.(
        editingMove.moveIndex * 2 +
          (editingMove.colour === PlayerColour.Black ? 1 : 0),
      );
    }
    dismiss();
  };

  return (
    <>
      <OptionSheet
        visible={displaySkipMoves}
        message="Illegal Moves Will Be Replaced with Skips"
        onCancel={() => setDisplaySkipMoves(false)}
        options={[
          {
            text: 'Confirm',
            onPress: handleConfirmSkips,
          },
        ]}
      />
      <Sheet
        visible={Boolean(editingMove)}
        dismiss={dismiss}
        title="Move options">
        <MoveOption
          onPress={() => {
            if (editingMove) {
              handleGameTime(
                editingMove.moveIndex * 2 +
                  (editingMove.colour === PlayerColour.Black ? 1 : 0),
              );
            }
            dismiss();
          }}
          colour={colours.primary}
          icon={<ICON_CLOCK color={colours.white} />}
          label="Record time"
        />
        <MoveOption
          onPress={handleDrawOffer}
          colour={colours.primary}
          icon={<ICON_HALF color={colours.white} />}
          label="Draw offer"
        />
        <MoveOption
          onPress={() => setDisplaySkipMoves(true)}
          colour={colours.primary}
          icon={<Icon name="edit" size={35} color={colours.white} />}
          label="Edit move"
        />
        <MoveOption
          onPress={dismiss}
          colour={colours.secondary}
          icon={<MaterialIcon name="cancel" size={35} color={colours.white} />}
          label="Cancel"
        />
      </Sheet>
    </>
  );
};

export default MoveOptionsSheet;
