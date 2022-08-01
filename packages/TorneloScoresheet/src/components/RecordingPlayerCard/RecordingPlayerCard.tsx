import React from 'react';
import { Player } from '../../types/ChessGameInfo';
import PrimaryText from '../PrimaryText/PrimaryText';

type recordingPlayerCardProps = {
  player: Player;
};

const RecordingPlayerCard: React.FC<recordingPlayerCardProps> = ({ player }) => {
  return (
    <PrimaryText label={player.firstName} />
  );
};

export default RecordingPlayerCard;
