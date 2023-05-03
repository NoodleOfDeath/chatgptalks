import React from 'react';

import { Menu } from 'react-native-paper';

import { Sentiment } from '~/api';
import {
  Button,
  Icon,
  MeterDial,
  Text,
  View,
  ViewProps,
} from '~/components';
import { useStyles, useTheme } from '~/hooks';

export type AnalyticsViewProps = Omit<ViewProps, 'children'> & {
  sentiments: Record<string, Sentiment>;
};

export function AnalyticsView({
  sentiments,
  ...props  
}: AnalyticsViewProps) {
  
  const style = useStyles(props);
  const theme = useTheme();
  
  const [showSentimentInfo, setShowSentimentInfo] = React.useState(false);
  
  const average = React.useMemo(() => {
    const scores = Object.values(sentiments).reduce((curr, prev) => curr + prev.score, 0);
    return scores / Object.values(sentiments).length;
  }, [sentiments]);
  
  const tokens = React.useMemo(() => {
    let tokens: Record<string, number> = {};
    Object.values(sentiments).forEach((s) => {
      tokens = { ...tokens, ...s.tokens };
    });
    return Object.entries(tokens).sort(([a], [b]) => a.toLowerCase() < b.toLowerCase() ? -1 : a.toLowerCase() > b.toLowerCase() ? 1 : 0);
  }, [sentiments]);
  
  const sentiment = React.useMemo(() => {
    if (average < -0.2) {
      if (average < -0.6) {
        return 'Very Negative';
      }
      return 'Negative';
    }
    if (average > 0.2) {
      if (average > 0.6) {
        return 'Very Positive';
      }
      return 'Positive';
    }
    return 'Neutral';
  }, [average]);
  
  return (
    <View style={ style }>
      <View col alignCenter gap={ 12 }>
        <View row gap={ 12 }>
          <Text>
            Sentiment Analysis
          </Text>
          <Menu
            contentStyle={ { 
              ...theme.components.card,
              borderRadius: 12,
              padding: 12,
              position: 'relative',
              top: 24,
              width: 200,
            } }
            visible={ showSentimentInfo }
            onDismiss={ () => setShowSentimentInfo(false) }
            anchor={
              <Button iconSize={ 24 } startIcon="information" onPress={ () => setShowSentimentInfo(true) } />
            }>
            <Text>Sentiment analysis is a tool that helps us understand how people feel about something by analyzing their language. It looks at the words people use and decides if they are positive, negative, or neutral. This can be useful in many areas, like understanding customer feedback or public opinion on a topic.</Text>
          </Menu>
        </View>
        <Text
          rounded
          bg={ /negative/i.test(sentiment) ? '#ff0000' : /positive/i.test(sentiment) ? '#00cc00' : '#888' }
          color="white"
          style={ { overflow: 'hidden' } }
          p={ 6 }>
          {`${ sentiment } ${average.toFixed(2)}`}
        </Text>
        <View row alignCenter>
          <Icon 
            name="emoticon-sad"
            color="#ff0000"
            size={ 36 } />
          <MeterDial value={ average } />
          <Icon 
            name="emoticon-happy"
            color="#00cc00"
            size={ 36 } />
        </View>
      </View>
      <View>
        <Text>Notable Tokens</Text>
        {tokens.map(([key]) => (
          <Text key={ key }>
            {`• ${key}`}
          </Text>
        ))}
      </View>
    </View>
  );
}