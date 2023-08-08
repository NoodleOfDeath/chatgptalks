import React from 'react';

import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  createDrawerNavigator,
} from '@react-navigation/drawer';

import { StackNavigation } from './StackNavigation';

import {
  ChannelIcon,
  Chip,
  DrawerItem,
  DrawerSection,
  Icon,
  Screen,
  Text,
  View,
} from '~/components';
import { SessionContext } from '~/contexts';
import { useNavigation } from '~/hooks';
import { strings } from '~/locales';

function HomeDrawer() {
  return (
    <Screen>
      <StackNavigation />
    </Screen>
  );
}

export function LeftDrawerContent(props: DrawerContentComponentProps) {
  
  const {
    navigate,
    openCategory,
    openPublisher,
  } = useNavigation();

  const {
    categories,
    publishers,
    bookmarkCount,
    unreadBookmarkCount,
    followedCategories,
    followedPublishers,
    viewFeature,
    hasViewedFeature,
  } = React.useContext(SessionContext);
  
  const publisherItems = React.useMemo(() => {
    if (!publishers) {
      return [];
    }
    const items = Object.keys({ ...followedPublishers }).sort().map((p) => {
      const publisher = publishers[p];
      if (!publisher) {
        return undefined;
      }
      return (
        <DrawerItem
          key={ publisher.name }
          label={ publisher.displayName }
          icon={ (props) => <ChannelIcon { ...props } publisher={ publisher } /> }
          onPress={ () => openPublisher(publisher) } />
      );
    }).filter(Boolean);
    if (items.length === 0) {
      items.push(
        <DrawerItem 
          key="missing-publishers"
          label={ (
            <Text flex={ 1 } numberOfLines={ 3 }>
              { strings.misc_noPublishers }
            </Text>
          ) } />
      );
    }
    items.push(
      <DrawerItem 
        key="browse-publishers"
        label={ strings.nav_browsePublishers }
        onPress={ () => {
          viewFeature('first-view-publishers');
          navigate('publisherPicker');
        } }
        icon={ (_props) => (
          <Chip
            leftIcon="pen"
            iconSize={ 24 }
            indicator={ !hasViewedFeature('first-view-publishers') } />
        ) }
        right={ (props) => <Icon { ...props } name="menu-right" /> } />
    );
    return items;
  }, [publishers, followedPublishers, viewFeature, hasViewedFeature, openPublisher, navigate]);
  
  const categoryItems = React.useMemo(() => {
    if (!categories) {
      return [];
    }
    const items = Object.keys({ ...followedCategories }).sort().map((c) => {
      const category = categories[c];
      if (!category) {
        return undefined;
      }
      return (
        <DrawerItem
          key={ category.name }
          label={ category.displayName }
          icon={ (props) => <Icon { ...props } name={ category.icon } /> }
          onPress={ () => openCategory(category) } />
      );
    }).filter(Boolean);
    if (items.length === 0) {
      items.push(
        <DrawerItem 
          key="missing-categories"
          label={ (
            <Text flex={ 1 } numberOfLines={ 3 }>
              { strings.misc_noCategories }
            </Text>
          ) } />
      );
    }
    items.push(
      <DrawerItem 
        key="browse-categories"
        label={ strings.nav_browseCategories }
        onPress={ () => {
          viewFeature('first-view-categories');
          navigate('categoryPicker');
        } }
        icon={ (_props) => (
          <Chip
            leftIcon="shape"
            iconSize={ 24 }
            indicator={ !hasViewedFeature('first-view-categories') } />
        ) }
        right={ (props) => <Icon { ...props } name="menu-right" /> } />
    );
    return items;
  }, [categories, followedCategories, viewFeature, hasViewedFeature, openCategory, navigate]);
  
  return (
    <DrawerContentScrollView { ...props }>
      <DrawerSection>
        <DrawerItem
          label={ `${strings.screens_bookmarks} (${bookmarkCount})` }
          icon={ (props) => (
            <Chip 
              { ...props }
              badge={ unreadBookmarkCount }
              iconSize={ 24 }
              leftIcon="bookmark" />
          ) }
          onPress= { () => navigate('bookmarks') } />
      </DrawerSection>
      <DrawerSection 
        title={ strings.misc_publishers }>
        {publisherItems}
      </DrawerSection>
      <DrawerSection
        title={ strings.misc_categories }>
        {categoryItems}
      </DrawerSection>
      <View my={ 12 } />
    </DrawerContentScrollView>
  );
}

const LeftDrawer = createDrawerNavigator();

export function LeftDrawerScreen() {
  return (
    <LeftDrawer.Navigator 
      id="LeftDrawer"
      initialRouteName={ 'home' }
      screenOptions={ ({ route: _route }) => ({
        headerShown: false,
        swipeEnabled: false,
      }) }
      drawerContent={ (props) => <LeftDrawerContent { ...props } /> }>
      <LeftDrawer.Screen 
        name={ strings.screens_home } 
        component={ HomeDrawer } />
    </LeftDrawer.Navigator>
  );
}