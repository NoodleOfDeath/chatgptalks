import React from 'react';
import { ListRenderItemInfo } from 'react-native';

import { SheetProps } from 'react-native-actions-sheet';
import AppIntroSlider from 'react-native-app-intro-slider';

import { 
  ActionSheet,
  Button,
  Icon,
  Text,
  View,
} from '~/components';
import { useTheme } from '~/hooks';

export type WalkthroughStep = React.ReactNode | {
  title?: React.ReactNode;
  body?: React.ReactNode;
  image?: string;
};

export type WalkthroughProps = {
  steps: WalkthroughStep[];
  onDone?: () => void;
};

export function Walkthrough({ payload, ...props }: SheetProps<WalkthroughProps>) {
  
  const theme = useTheme();

  const { steps = [], onDone } = React.useMemo(() => ({ ...payload }), [payload]);
  
  const computedSteps = React.useMemo(() => steps.map((step, i) => (
    <View flexWrap="wrap" key={ i }>
      {React.isValidElement(step) ? step : (
        <React.Fragment>
          {step.title && <Text h5 bold textCenter>{step.title}</Text>}
          {typeof step.body === 'string' ? (
            <Text>{step.body}</Text>
          ) : step.body}
        </React.Fragment>
      )}
    </View>
  )), [steps]);
  
  const renderItem = React.useCallback(({ item }: ListRenderItemInfo<React.ReactNode>) => {
    return (
      <View
        flexGrow={ 1 }
        p={ 32 }
        gap={ 12 }
        alignCenter
        justifyCenter>
        {item}
      </View>
    );
  }, []);
  
  const renderPrevButton = React.useCallback(() => {
    return (
      <View 
        elevated
        width={ 40 }
        height={ 40 }
        justifyCenter
        alignCenter
        borderRadius={ 24 }>
        <Icon
          name="arrow-left"
          color={ theme.colors.text }
          size={ 24 } />
      </View>
    );
  }, [theme]);
  
  const renderNextButton = React.useCallback(() => {
    return (
      <View 
        elevated
        width={ 40 }
        height={ 40 }
        justifyCenter
        alignCenter
        borderRadius={ 24 }>
        <Icon
          name="arrow-right"
          color={ theme.colors.text }
          size={ 24 } />
      </View>
    );
  }, [theme]);
  
  const renderSkipButton = React.useCallback(() => {
    return (
      <View 
        elevated
        ph={ 10 }
        height={ 40 }
        justifyCenter
        alignCenter
        borderRadius={ 24 }>
        <Text>Skip</Text>
      </View>
    );
  }, [theme]);
  
  const renderDoneButton = React.useCallback(() => {
    return (
      <View 
        elevated
        ph={ 10 }
        height={ 40 }
        justifyCenter
        alignCenter
        borderRadius={ 24 }>
        <Text>Got it!</Text>
      </View>
    );
  }, [theme]);
  
  return (
    <ActionSheet id={ props.sheetId }>
      <View height="100%">
        <AppIntroSlider
          renderItem={ renderItem }
          renderPrevButton={ renderPrevButton }
          renderNextButton={ renderNextButton }
          renderSkipButton={ renderSkipButton }
          renderDoneButton={ renderDoneButton }
          onDone={ onDone }
          showPrevButton
          showSkipButton
          dotStyle={ { backgroundColor: theme.colors.textDisabled } }
          activeDotStyle={ { backgroundColor: theme.colors.text } }
          data={ computedSteps } />
      </View>
    </ActionSheet>
  );
  
}