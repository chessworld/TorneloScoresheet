import React from 'react';
import { colours } from '../../style/colour';
import PrimaryText, { FontWeight } from '../PrimaryText/PrimaryText';

type cardRowTextSectionProps = {
  textContent: string;
};

const CardRowTextSection: React.FC<cardRowTextSectionProps> = ({
  textContent,
}) => {
  return (
    <PrimaryText
      size={15}
      weight={FontWeight.Medium}
      colour={colours.secondary70}
      label={textContent}
    />
  );
};

export default CardRowTextSection;
