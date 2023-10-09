import React from 'react';

import {
  EventMapBase,
  NavigationState,
  RouteConfig,
} from '@react-navigation/native';
import {
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import { CategoryPickerScreen } from './screens/settings/CategoryPickerScreen';
import { PublisherPickerScreen } from './screens/settings/PublisherPickerScreen';

import {
  DrawerToggle,
  SearchMenu,
  SettingsToggle,
} from '~/components';
import { SessionContext } from '~/contexts';
import { strings } from '~/locales';
import {
  BookmarksScreen,
  CategoryScreen,
  ColorSchemePickerScreen,
  FontPickerScreen,
  HomeScreen,
  LegalScreen,
  NotificationSettingsScreen,
  PublisherScreen,
  ReadingFormatPickerScreen,
  RecapScreen,
  RoutingParams,
  SearchScreen,
  SettingsScreen,
  ShortPressFormatPickerScreen,
  StatsScreen,
  SummaryScreen,
  TestScreen,
  TriggerWordPickerScreen,
} from '~/screens';

const DrawerToggleWithIndicator = () => {
  const { hasViewedFeature, unreadBookmarkCount } = React.useContext(SessionContext);
  return (
    <DrawerToggle
      indicator={ !hasViewedFeature('first-view-publishers', 'first-view-categories') || (unreadBookmarkCount > 0 && !hasViewedFeature('unread-bookmarks')) } />
  );
};

const SettingsToggleWithIndicator = () => {
  const { hasViewedFeature } = React.useContext(SessionContext);
  return (
    <SettingsToggle
      indicator={ !hasViewedFeature(
        'first-view-settings',
        'first-view-notifs'
      ) } />
  );
};

export const STACK_SCREENS: RouteConfig<
  RoutingParams,
  keyof RoutingParams,
  NavigationState,
  NativeStackNavigationOptions,
  EventMapBase
>[] = [
  // Home Tab
  {
    component: HomeScreen, 
    name: 'home',
    options: { 
      headerBackTitle: '',
      headerLeft: () => <DrawerToggleWithIndicator />,
      headerRight: () => <SettingsToggleWithIndicator />,
      headerTitle: () => <SearchMenu />,
    },
  },
  // Screens
  {
    component: SearchScreen, 
    name: 'search',
    options: { 
      headerBackTitle: '',
      headerRight: () => <SettingsToggleWithIndicator />,
      headerTitle: '', 
    },
  },
  {
    component: SummaryScreen, 
    name: 'summary',  
    options: { 
      headerBackTitle: '',
      headerRight: () => <SettingsToggleWithIndicator />,
      headerTitle: '', 
    },
  },
  {
    component: RecapScreen,
    name: 'recap',  
    options: {
      headerBackTitle: '',
      headerRight: () => <SettingsToggleWithIndicator />,
      headerTitle: '', 
    },
  },
  {
    component: CategoryScreen, 
    name: 'category',
    options: { 
      headerBackTitle: '', 
      headerRight: () => <SettingsToggleWithIndicator />,
      headerTitle: '', 
    },
  },
  {
    component: PublisherScreen, 
    name: 'publisher',
    options: {
      headerBackTitle: '', 
      headerRight: () => <SettingsToggleWithIndicator />,
      headerTitle: '', 
    },
  },
  {
    component: BookmarksScreen, 
    name: 'bookmarks', 
    options: {
      headerBackTitle: '',
      headerRight: () => <SettingsToggleWithIndicator />,
      headerTitle: strings.screens_bookmarks, 
    }, 
  }, 
  // Settings
  {
    component: SettingsScreen, 
    name: 'settings', 
    options: {
      headerBackTitle: '',
      headerRight: () => undefined, 
      headerTitle: strings.screens_settings, 
    },
  },
  {
    component: PublisherPickerScreen,
    name: 'publisherPicker',
    options: {
      headerBackTitle: '',
      headerRight: () => undefined, 
      headerTitle: strings.screens_publishers, 
    },
  },
  {
    component: CategoryPickerScreen,
    name: 'categoryPicker',
    options: {
      headerBackTitle: '',
      headerRight: () => undefined, 
      headerTitle: strings.screens_categories, 
    },
  },
  {
    component: NotificationSettingsScreen,
    name: 'notifications',
    options: {
      headerBackTitle: '',
      headerRight: () => undefined, 
      headerTitle: strings.screens_notifications, 
    },
  },
  {
    component: ColorSchemePickerScreen, 
    name: 'colorSchemePicker',  
    options: {
      headerBackTitle: '',
      headerRight: () => undefined, 
      headerTitle: strings.screens_colorScheme, 
    },
  },
  {
    component: FontPickerScreen,
    name: 'fontPicker',  
    options: {
      headerBackTitle: '',
      headerRight: () => undefined, 
      headerTitle: strings.screens_font, 
    },
  },
  {
    component: ShortPressFormatPickerScreen,
    name: 'shortPressFormatPicker',  
    options: {
      headerBackTitle: '',
      headerRight: () => undefined, 
      headerTitle: strings.screens_preferredShortPressFormat, 
    },
  },
  {
    component: ReadingFormatPickerScreen,
    name: 'readingFormatPicker',  
    options: {
      headerBackTitle: '',
      headerRight: () => undefined, 
      headerTitle: strings.screens_preferredReadingFormat, 
    },
  },
  {
    component: TriggerWordPickerScreen,
    name: 'triggerWordPicker',  
    options: {
      headerRight: () => undefined, 
      headerTitle: strings.screens_triggerWords, 
    },
  },
  {
    component: LegalScreen, 
    name: 'legal', 
    options: {
      headerBackTitle: '',
      headerRight: () => undefined, 
      headerTitle: strings.screens_legal, 
    },
  },
  // Other
  {
    component: StatsScreen,
    name: 'stats',
    options: {
      headerBackTitle: '',
      headerRight: () => undefined,
      headerTitle: 'stats', 
    },
  },
  {
    component: TestScreen,
    name: 'test',
    options: {
      headerBackTitle: '',
      headerRight: () => undefined,
      headerTitle: 'test', 
    },
  },
];

const Stack = createNativeStackNavigator();

export function StackNavigation({ initialRouteName = 'default' }: { initialRouteName?: string } = {}) {
  return (
    <Stack.Navigator 
      id="Stack"
      initialRouteName={ initialRouteName }>
      {STACK_SCREENS.map((screen) => (
        <Stack.Screen
          key={ String(screen.name) }
          { ...screen }
          options={ { 
            headerShown: true,
            ...screen.options,
          } } />
      ))}
    </Stack.Navigator>
  );
  
}
