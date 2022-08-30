declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

declare module 'country-iso-3-to-2' {
  export default function (iso3: string): string | undefined;
}

declare module 'react-native-markdown-package' {
  const component: React.FC<{ styles: StyleProp<View> }>;
  export default component;
}
