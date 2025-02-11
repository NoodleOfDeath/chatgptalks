import React from 'react';

import { Drawer } from 'react-native-paper';

import {
  ChildlessViewProps,
  IconProps,
  TextProps,
} from '~/components';
import {
  useStyles,
  useTextStyles,
  useTheme,
} from '~/hooks';

export type DrawerItemProps = Omit<ChildlessViewProps & Parameters<typeof Drawer.Item>[0] & TextProps, 'label' | 'left' | 'right'> & {
  label?: React.ReactNode | (() => React.ReactNode);
  left?: React.ReactNode | (() => React.ReactNode);
  right?: React.ReactNode | ((props: IconProps) => React.ReactNode);
};

export function DrawerItem({
  my = -6,
  left,
  right,
  ...props
}: DrawerItemProps) {
  const theme = useTheme();
  const style = useStyles({ ...props, my });
  const textStyle = useTextStyles({ ...props });
  return (
    <Drawer.Item
      theme={ {
        colors: { 
          onSecondaryContainer: theme.colors.text,
          onSurfaceVariant: theme.colors.text, 
          primary: theme.colors.text,
        },
        isV3: true, 
      } }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      left={ left as any }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      right={ right as any }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { ...props as any }
      style={ [style, textStyle] } />
  );
}