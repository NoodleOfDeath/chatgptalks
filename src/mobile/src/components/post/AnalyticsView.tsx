import React from 'react';

import { BarChart } from 'react-native-chart-kit';

import { PublicSummarySentimentAttributes } from '~/api';
import {
  CollapsedView,
  MeterDial,
  Text,
  View,
  ViewProps,
} from '~/components';
import { useStyles } from '~/hooks';
import { strings } from '~/locales';
import { fixedSentiment } from '~/utils';

export type AnalyticsViewProps = Omit<ViewProps, 'children'> & {
  sentiment: number;
  sentiments: PublicSummarySentimentAttributes[];
};

const chartConfig = {
  backgroundColor: '#ccc',
  color: (opacity = 1) => `rgba(255, 255, 146, ${opacity})`,
};

export function AnalyticsView({
  sentiment = 0,
  sentiments = [],
  ...props  
}: AnalyticsViewProps) {
  
  const style = useStyles(props);

  const sentimentLabel = React.useMemo(() => {
    if (sentiment < -0.2) {
      if (sentiment < -0.6) {
        return strings.summary.veryNegative;
      }
      return strings.summary.negative;
    }
    if (sentiment > 0.2) {
      if (sentiment > 0.6) {
        return strings.summary.veryPositive;
      }
      return strings.summary.positive;
    }
    return strings.summary.neutral;
  }, [sentiment]);
  
  const chartData = React.useMemo(() => {
    const sets = [...sentiments].sort((a, b) => a.method.localeCompare(b.method));
    const data = {
      datasets: [{
        color: (opacity = 1) => {
          return `rgba(255, 255, 146, ${opacity})`;
        },
        data: sets.map((s) => Number(s.score.toFixed(2))),
      }],
      labels: sets.map((s) => s.method),
    };
    return data;
  }, [sentiments]);
  
  return (
    <View style={ style } gap={ 12 }>
      <CollapsedView
        initiallyCollapsed
        title={ strings.summary.sentimentAnalysis }
        info={ strings.summary.sentimentAnalysisInfo }>
        <View gap={ 12 }>
          <View row alignStart gap={ 12 }>
            <View
              elevated
              bg={ sentiment < -0.2 ? '#ff0000' : sentiment > 0.2 ? '#00cc00' : '#888' }
              p={ 8 }>
              <Text color="white">{`${ sentimentLabel } ${fixedSentiment(sentiment)}`}</Text>
            </View>
            <MeterDial width={ 80 } value={ sentiment } />
          </View>
          <View>
            <View>
              <BarChart
                width={ 300 }
                height={ 200 }
                data={ chartData }
                fromZero
                showValuesOnTopOfBars
                chartConfig={ chartConfig }
                yAxisLabel=""
                yAxisSuffix="" />
            </View>
          </View>
        </View>
      </CollapsedView>
    </View>
  );
}