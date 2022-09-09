import React from 'react';

type ConditionalWrapperProps = {
  condition: boolean;
  wrap: (children: React.ReactNode) => React.ReactNode;
};

const ConditionalWrapper: React.FC<ConditionalWrapperProps> = ({
  condition,
  wrap,
  children,
}) => {
  return <>{condition ? wrap(children) : children}</>;
};

export default ConditionalWrapper;
