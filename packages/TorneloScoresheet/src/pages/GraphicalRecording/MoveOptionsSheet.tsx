import React from 'react';
import Sheet from '../../components/Sheet/Sheet';
import { colours } from '../../style/colour';
import { ICON_CLOCK, ICON_HALF } from '../../style/images';
import { PlayerColour } from '../../types/ChessGameInfo';
import MoveOption from './MoveOption';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useRecordingState } from '../../context/AppModeStateContext';
import {
  ReversibleAction,
  ReversibleActionType,
} from '../../types/ReversibleAction';

// A way of identifying a move within the current game
export type MoveIdentifer = {
  colour: PlayerColour;
  moveIndex: number;
};

type MoveOptionsSheetProps = {
  showOptionsFor: MoveIdentifer | undefined;
  handleGameTime: (index: number) => void;
  dismiss: () => void;
  editMove: () => void;
  pushUndoAction: (action: ReversibleAction) => void;
};

const MoveOptionsSheet = ({
  showOptionsFor,
  handleGameTime,
  dismiss,
  pushUndoAction,
  editMove,
}: MoveOptionsSheetProps) => {
  const recordingState = useRecordingState();
  const toggleDraw = recordingState?.toggleDraw;

  const handleDrawOffer = () => {
    if (!toggleDraw || !showOptionsFor) {
      return;
    }
    const indexOfPlyInHistory =
      showOptionsFor.moveIndex * 2 +
      (showOptionsFor.colour === PlayerColour.Black ? 1 : 0);
    pushUndoAction({
      type: ReversibleActionType.ToggleDrawOffer,
      indexOfPlyInHistory,
    });
    toggleDraw(indexOfPlyInHistory);
    dismiss();
  };

  return (
    <>
      <Sheet
        visible={Boolean(showOptionsFor)}
        dismiss={dismiss}
        title="Move options">
        <MoveOption
          onPress={() => {
            if (showOptionsFor) {
              handleGameTime(
                showOptionsFor.moveIndex * 2 +
                  (showOptionsFor.colour === PlayerColour.Black ? 1 : 0),
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
          onPress={editMove}
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
