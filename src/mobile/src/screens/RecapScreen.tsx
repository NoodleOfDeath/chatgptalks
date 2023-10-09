import React from 'react';

import { Recap, RoutedScreen } from '~/components';
import { ScreenProps } from '~/screens';

export function RecapScreen({ route }: ScreenProps<'recap'>) {
  const recap = React.useMemo(() => route?.params?.recap, [route]);
  return (
    <RoutedScreen>
      {recap && (
        <Recap
          expanded
          recap={ recap } />
      )}
    </RoutedScreen>
  );
}