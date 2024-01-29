import React from 'react';
import {
  DeviceEventEmitter,
  Linking,
  Platform,
} from 'react-native';

import { APP_STORE_LINK, PLAY_STORE_LINK } from '@env';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import {
  EventMapBase,
  NavigationContainer,
  NavigationState,
  RouteConfig,
} from '@react-navigation/native';
import ms from 'ms';
import { SheetProvider } from 'react-native-actions-sheet';
import InAppReview from 'react-native-in-app-review';

import { RoutedScreen } from './RoutedScreen';
import { StackNavigator } from './StackNavigator';
import { TabbedNavigator } from './TabbedNavigator';
import {
  ACCOUNT_STACK,
  HOME_STACK,
  LOGIN_STACK,
  SETTINGS_STACK,
} from './stacks';

import {
  ActivityIndicator,
  Button,
  Dialog,
  Icon,
  MediaPlayer,
  Screen,
  Text,
  View,
} from '~/components';
import {
  LayoutContext,
  MediaContext,
  NotificationContext,
  OrientationType,
  StorageContext,
  ToastContext,
} from '~/contexts';
import { useAppState, useTheme } from '~/hooks';
import { strings } from '~/locales';
import { NAVIGATION_LINKING_OPTIONS, RoutingParams } from '~/screens';
import { usePlatformTools } from '~/utils';

export function HomeTab() {
  return (
    <RoutedScreen safeArea={ false }>
      <StackNavigator
        id='HomeTabNav'
        initialRouteName='home'
        screens={ HOME_STACK } />
    </RoutedScreen>
  );
}

export function SettingsTab() {
  return (
    <RoutedScreen safeArea={ false }>
      <StackNavigator
        id='SettingsTabNav'
        initialRouteName='settings'
        screens={ [...SETTINGS_STACK, ...ACCOUNT_STACK] } />
    </RoutedScreen>
  );
}

const ROOT_TABS: RouteConfig<
RoutingParams,
keyof RoutingParams,
NavigationState,
BottomTabNavigationOptions,
EventMapBase
>[] = [
  {
    component: HomeTab,
    name: 'homeTab',
    options: {
      tabBarIcon: () => <Icon name='home' />,
      tabBarLabel: strings.home,
    },
  },
  {
    component: SettingsTab,
    name: 'settingsTab',
    options: {
      tabBarIcon: () => <Icon name='cog' />,
      tabBarLabel: strings.settings,
    },
  },
];

export function RootNavigator() {
  
  const { emitStorageEvent, needsUpdate } = usePlatformTools();
  const theme = useTheme();
  
  const {
    isTablet,
    lockRotation,
    unlockRotation,
  } = React.useContext(LayoutContext);
  const storage = React.useContext(StorageContext);
  const {
    ready, 
    syncState,
    lastRequestForReview = 0,
    readSummaries,
    pushNotificationsEnabled,
    userData,
    setStoredValue,
    setErrorHandler,
    syncWithRemote,
  } = storage;
  const { showToast } = React.useContext(ToastContext);
  const { isRegisteredForRemoteNotifications, registerRemoteNotifications } = React.useContext(NotificationContext);
  const { currentTrack } = React.useContext(MediaContext);
  
  const [lastSync, setLastSync] = React.useState(0);
  const [showedReview, setShowedReview] = React.useState(false);

  React.useEffect(() => {
    if (!isTablet) {
      lockRotation(OrientationType.PORTRAIT);
    } else {
      unlockRotation();
    }
  }, [isTablet, lockRotation, unlockRotation]);

  React.useEffect(() => {
    if (!ready || !userData?.valid) {
      return;
    }
    if (pushNotificationsEnabled !== false && !isRegisteredForRemoteNotifications()) {
      registerRemoteNotifications();
    }
  }, [ready, userData, pushNotificationsEnabled, isRegisteredForRemoteNotifications, registerRemoteNotifications]);

  React.useEffect(() => {
    if (!ready || !userData?.valid) {
      return;
    }

    if (!showedReview && 
      (Date.now() - lastRequestForReview > ms('2w') && 
      (Object.keys({ ...readSummaries }).length > 2))) {

      const inAppReviewHandler = async () => {
        try {
          const available = InAppReview.isAvailable();
          if (!available) {
            emitStorageEvent('in-app-review-failed', 'unavailable');
            return;
          }
          let success = false;
          if (Platform.OS === 'ios') {
            success = await InAppReview.RequestInAppReview();
          } else {
            success = await InAppReview.requestInAppCommentAppGallery();
          }
          setShowedReview(success);
          emitStorageEvent(success ? 'in-app-review' : 'in-app-review-failed');
          setStoredValue('lastRequestForReview', Date.now());
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.error(error);
          showToast(error?.errorKey ?? error?.message ?? 'Unknown error');
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          emitStorageEvent('in-app-review-failed', JSON.stringify(error));
        }
      };

      // in-app review handlers
      const reviewHandlerA = DeviceEventEmitter.addListener('follow-category', inAppReviewHandler);
      const reviewHandlerB = DeviceEventEmitter.addListener('follow-publisher', inAppReviewHandler);
      const reviewHandlerC = DeviceEventEmitter.addListener('bookmark-summary', inAppReviewHandler);
      const reviewHandlerD = DeviceEventEmitter.addListener('read-summary', inAppReviewHandler);
      const reviewHandlerE = DeviceEventEmitter.addListener('read-recap', inAppReviewHandler);

      return () => {
        reviewHandlerA.remove();
        reviewHandlerB.remove();
        reviewHandlerC.remove();
        reviewHandlerD.remove();
        reviewHandlerE.remove();
      };

    }
  }, [ready, userData, readSummaries, lastRequestForReview, showedReview, emitStorageEvent, setStoredValue, showToast]);

  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setErrorHandler((e: any) => {
      if (!e) {
        return;
      }
      console.error(e);
      showToast(e);
    });
  }, [setErrorHandler, showToast]);
  
  useAppState({
    onForeground: React.useCallback(async () => {
      if (lastSync > Date.now() - ms('2m')) {
        return;
      }
      await syncWithRemote();
      setLastSync(Date.now());
    }, [syncWithRemote, lastSync]),
  });
  
  if (!ready) {
    const text = syncState?.isFetching ? strings.syncing : strings.loading;
    return (
      <Screen>
        <View
          p={ 24 }
          gap={ 12 }
          flexGrow={ 1 }
          itemsCenter
          justifyCenter
          bg={ theme.colors.paper }>
          <ActivityIndicator />
          <Text textCenter>
            {text}
          </Text>
        </View>
      </Screen>
    );
  }

  if (needsUpdate) {
    return (
      <Dialog
        visible
        title={ strings.aNewVersionIsAvailable }
        actions={ [
          <Button
            contained
            key="ok"
            onPress={ () => {
              Linking.openURL(Platform.select({ android: PLAY_STORE_LINK, ios: APP_STORE_LINK }) ?? '');
            } }>
            {strings.update}

          </Button>,
        ] }>
        <Text>{strings.pleaseUpdateToContinue}</Text>
      </Dialog>
    );
  }

  return (
    <NavigationContainer
      theme= { theme.navContainerTheme }
      linking={ NAVIGATION_LINKING_OPTIONS }>
      <SheetProvider>
        {(userData?.valid || userData?.unlinked) ? (
          <React.Fragment>
            <TabbedNavigator 
              id="rootTabNav"
              screens={ ROOT_TABS }
              screenOptions={ { headerShown: false } } />
            <MediaPlayer visible={ Boolean(currentTrack) } />
          </React.Fragment>
        ) : (
          <RoutedScreen safeArea={ false }>
            <StackNavigator
              id="loginStackNav" 
              screens={ LOGIN_STACK }
              screenOptions={ { headerShown: false } } />
          </RoutedScreen>
        )}
      </SheetProvider>
    </NavigationContainer>
  );
}

