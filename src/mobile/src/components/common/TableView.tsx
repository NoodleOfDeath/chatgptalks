import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

// eslint-disable-next-line import-newlines/enforce
import { TableView as RNTableView, THEME_APPEARANCE } from 'react-native-tableview-simple';

import { ChildlessViewProps } from '~/components';
import { useStyles, useTheme } from '~/hooks';

export type TableIndex = {
  section: number;
  index: number;
};

export type TableViewProps = ChildlessViewProps & {
  children?: React.ReactNode;
  appearance?: string | 'auto' | 'dark' | 'light';
  customAppearances?: {
    [key: string]: THEME_APPEARANCE;
  };
  style?: StyleProp<ViewStyle>;
};

export function TableView({ children, ...props }: TableViewProps) {
  const theme = useTheme();
  const style = useStyles(props);
  return (
    <RNTableView
      appearance={ theme.isDarkMode ? 'dark' : 'light' }
      { ...props }
      style={ [style, { flex: 1, flexGrow: 1 }] }>
      {children}
    </RNTableView>
  );
}   