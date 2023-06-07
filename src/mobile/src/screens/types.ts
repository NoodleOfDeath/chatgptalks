import React from 'react';

import {
  LinkingOptions,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  PublicCategoryAttributes,
  PublicOutletAttributes,
  PublicSummaryAttributes,
  ReadingFormat,
} from '~/api';

export type TabParams = {
  default: undefined;
};

export type ChannelType = 'outlet' | 'category';

export type Channel<T extends ChannelType = ChannelType> = {
  type: T;
  attributes: T extends 'outlet'
    ? PublicOutletAttributes
    : PublicCategoryAttributes;
};

export type StackableTabParams = TabParams & {
  about: undefined;
  bookmarks: undefined;
  browse: undefined;
  channel: Channel;
  search: {
    prefilter?: string,
    onlyCustomNews?: boolean;
    specificIds?: number[];
    noHeader?: boolean;
  },
  settings: undefined;
  summary: {
    initialFormat?: ReadingFormat;
    initiallyTranslated?: boolean;
    keywords?: string[];
    summary: PublicSummaryAttributes | number;
    showAnalytics?: boolean;
  };
};

export const NAVIGATION_LINKING_OPTIONS: LinkingOptions<StackableTabParams> = {
  config: {
    screens: {
      bookmarks: { path: 'bookmarks' },
      browse: { path: 'browse' },
      channel: { path: 'channel' },
      default: { path: '' },
      search: { path: 'search' },
      settings: { path: 'settings' },
      summary: { path: 'summary' },
    },
  },
  prefixes: [
    '/',
    'https://dev.readless.ai',
    'https://readless.ai', 
    'https://www.readless.ai', 
    'readless://',
  ],
};

export type ScreenComponentType<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList
> =
  | React.ComponentType<{
      route: RouteProp<ParamList, RouteName>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      navigation: any;
    }>
  // eslint-disable-next-line @typescript-eslint/ban-types
  | React.ComponentType<{}>;

export type ScreenProps<Path extends keyof StackableTabParams = keyof StackableTabParams, C extends React.ComponentType = React.ComponentType> = {
  name?: Path;
  component?: C;
  icon?: string;
  headerRight?:
    | ((props: {
        tintColor?: string;
        pressColor?: string;
        pressOpacity?: number;
      }) => React.ReactNode)
    ;
  route?: RouteProp<StackableTabParams, Path> 
  navigation?: NativeStackNavigationProp<StackableTabParams, Path>
};
