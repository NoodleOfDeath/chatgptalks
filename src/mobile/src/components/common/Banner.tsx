import React from 'react';

import { Button } from './Button';
import { View } from './View';

import { useStyles, useTheme } from '~/hooks';

export type BannerActionProps = {
  icon?: string;
  label?: string;
  onPress: () => void;
  disabled?: boolean;
};

export type BannerProps = React.PropsWithChildren & {
  visible?: boolean;
  actions: BannerActionProps[];
};

export function Banner({ 
  children,
  visible,
  actions,
  ...props
}: BannerProps) {

  const theme = useTheme();
  const style = useStyles(props);
  
  const [minimized, setMinimized] = React.useState(false);

  return (
    <React.Fragment>
      {visible && (
        <View
          bg={ theme.colors.primary } 
          style={ style } 
          gap={ 8 }
          p={ 16 }>
          <View justifyCenter alignEnd>
            <View>
              <Button 
                onPress={ ()=> setMinimized(!minimized) }
                startIcon={ minimized ? 'chevron-up' : 'chevron-down' }
                elevated
                p={ 4 }
                rounded />
            </View>
          </View>
          {minimized === false && (
            <View>
              {children}
            </View>
          )}
          <View height={ 54 } alignCenter>
            <View row alignCenter gap={ 16 }>
              {actions.map((action, index) => (
                <View key={ index }>
                  <Button
                    elevated
                    rounded
                    p={ 16 }
                    iconSize={ 24 }
                    disabled={ action.disabled }
                    startIcon={ action.icon }
                    onPress={ action.onPress } />
                </View>
              ))}
            </View>
          </View>
        </View>
      )}
    </React.Fragment>
  );
}