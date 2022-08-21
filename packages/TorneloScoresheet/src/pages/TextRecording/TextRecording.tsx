import React from 'react';
import MoveSelector from '../../components/MoveSelector/MoveSelector';

const TextRecording: React.FC = () => {
  return (
    <MoveSelector
      message={'This is a placeholder message'}
      onSelectOption={selectedOption => {
        console.log(selectedOption.toString() + ' has been pressed');
      }}
      options={['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']}
    />
  );
};

export default TextRecording;
