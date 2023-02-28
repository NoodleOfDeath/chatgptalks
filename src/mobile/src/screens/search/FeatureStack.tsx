import React from 'react';

import { SheetManager } from 'react-native-actions-sheet';

import { CardStack, Text } from '~/components';
import { SessionContext } from '~/core';
import { strings } from '~/locales';

type Feature = {
  id: string;
  content?: React.ReactNode;
  onPress?: () => void;
};

export const FEATURES: Feature[] = [
  {
    content: (
      <React.Fragment>
        <Text h6 numberOfLines={ 2 }>{strings.features.sentiment.sentiment}</Text>
        <Text bold underline>{strings.actions.tapToEnable}</Text>
      </React.Fragment>
    ),
    id: 'sentiment-walkthrough',
    onPress: async () => {
      await SheetManager.show('sentiment-walkthrough');
    },
  },
  {
    content: (
      <React.Fragment>
        <Text h6>{strings.features.triggerWarning.triggerWarning}</Text>
        <Text bold underline>{strings.actions.tapToEnable}</Text>
      </React.Fragment>
    ),
    id: 'trigger-warning-walkthrough',
    onPress: async () => {
      await SheetManager.show('trigger-warning-walkthrough');
    },
  },
];

type Props = {
  onClose?: () => void;
};

export function FeatureStack({ onClose }: Props = {}) {
  
  const { viewedFeatures } = React.useContext(SessionContext);
  const cards = React.useMemo(() => FEATURES.filter((feature) => !(feature.id in (viewedFeatures ?? {}))), [viewedFeatures]);
  
  return cards.length > 0 && (
    <CardStack
      mh={ 12 }
      mb={ 12 }
      onClose={ onClose }
      onPressItem={ (index) => cards[index].onPress?.() }>
      {cards.map((card) => (
        <React.Fragment key={ card.id }>
          {card.content}
        </React.Fragment>
      ))}
    </CardStack>
  );
}