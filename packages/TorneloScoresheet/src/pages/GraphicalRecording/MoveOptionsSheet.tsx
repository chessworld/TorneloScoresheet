import React from 'react';
import Sheet from '../../components/Sheet/Sheet';
import { colours } from '../../style/colour';
import { ICON_CLOCK, ICON_HALF } from '../../style/images';
import { PlayerColour } from '../../types/ChessGameInfo';
import MoveOption from './MoveOption';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useRecordingState } from '../../context/AppModeStateContext';

export type EditingMove = {
  colour: PlayerColour;
  moveIndex: number;
};

type MoveOptionsSheetProps = {
  editingMove: EditingMove | undefined;
  handleGameTime: (index: number) => void;
  dismiss: () => void;
};

const MoveOptionsSheet = ({
  editingMove,
  handleGameTime,
  dismiss,
}: MoveOptionsSheetProps) => {
  const recordingState = useRecordingState();
  const actions = recordingState?.[1];

  const toggleDraw = actions?.toggleDraw;

  const handleDrawOffer = () => {
    if (!toggleDraw || !editingMove) {
      return;
    }
    toggleDraw(
      editingMove.moveIndex * 2 +
        (editingMove.colour === PlayerColour.Black ? 1 : 0),
    );
    dismiss();
  };

  return (
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
        onPress={() => undefined}
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
  );
};

export default MoveOptionsSheet;
