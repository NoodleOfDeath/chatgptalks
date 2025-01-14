import React from 'react';

import { useFocusEffect } from '@react-navigation/native';

import { ScreenComponent } from './types';

import {
  Button,
  ChannelIcon,
  Screen,
  ScrollView,
  TableView,
  TableViewCell,
  TableViewSection,
  Text,
  View,
} from '~/components';
import { StorageContext } from '~/contexts';
import { useNavigation } from '~/hooks';
import { strings } from '~/locales';
import { SearchViewController } from '~/navigation';

export function SearchScreen({ route }: ScreenComponent<'search'>) {

  const { 
    searchHistory,
    publishers, 
    categories,
    hasViewedFeature,
    viewFeature,
  } = React.useContext(StorageContext);

  const {
    search,
    openPublisher,
    openCategory,
    navigate,
    navigation,
  } = useNavigation();

  const [searchText, setSearchText] = React.useState(route?.params?.prefilter);
  
  const filteredHistory = React.useMemo(() => searchHistory?.filter((q) => new RegExp(searchText ?? '.').test(q)).slice(0, 5), [searchHistory, searchText]);
  const filteredPublishers = React.useMemo(() => Object.values(publishers ?? {}).filter((publisher) => new RegExp(searchText ?? '.', 'i').test(publisher.displayName)), [publishers, searchText]);
  const filteredCategories = React.useMemo(() => Object.values(categories ?? {}).filter((category) => new RegExp(searchText ?? '.', 'i').test(category.displayName)), [categories, searchText]);
 
  useFocusEffect(React.useCallback(() => {
    navigation?.setOptions({
      headerTitle: () => (
        <SearchViewController
          initialValue={ route?.params?.prefilter } 
          onChangeText={ setSearchText } />
      ), 
    });
  }, [route, navigation]));

  return (
    <Screen>
      <ScrollView>
        <TableView>
          <TableViewSection
            grouped
            headerComponent={ (
              <Button
                system
                alignStart
                p={ 12 }>
                {strings.history}
              </Button>
            ) }>
            {filteredHistory?.map((q) => (
              <TableViewCell
                system
                key={ q }
                title={ q }
                onPress={ () => search({ prefilter: q }) } />
            ))}
          </TableViewSection>
          <TableViewSection
            grouped
            headerComponent={ (
              <Button
                system
                alignStart
                p={ 12 }
                indicator={ !hasViewedFeature('publishers') }
                gap={ 12 }
                rightIcon="chevron-right"
                onPress={ () => {
                  viewFeature('publishers');
                  navigation?.navigate('publisherPicker');
                } }>
                {strings.publishers}
              </Button>
            ) }>
            <TableViewCell
              cellContentView={ (
                <ScrollView horizontal>
                  <View flexRow gap={ 12 }>
                    {filteredPublishers.length === 0 ? (<Text>{strings.noResults}</Text>) : filteredPublishers.map((pub) => (
                      <Button
                        system
                        vertical
                        key={ pub.name }
                        leftIcon={ <ChannelIcon publisher={ pub } /> }
                        p={ 12 }
                        gap={ 12 }
                        onPress={ () => openPublisher(pub) }>
                        {pub.displayName}
                      </Button>
                    ))}
                  </View>
                </ScrollView>
              ) } />
          </TableViewSection>
          <TableViewSection
            grouped
            headerComponent={ (
              <Button
                system
                alignStart
                p={ 12 }
                indicator={ !hasViewedFeature('categories') }
                gap={ 12 }
                rightIcon="chevron-right"
                onPress={ () => {
                  viewFeature('categories');
                  navigate('categoryPicker');
                } }>
                {strings.categories}
              </Button>
            ) }>
            <TableViewCell
              cellContentView={ (
                <ScrollView horizontal>
                  <View flexRow gap={ 12 }>
                    {filteredCategories.length === 0 ? (<Text>{strings.noResults}</Text>) : filteredCategories.map((cat) => (
                      <Button
                        system
                        vertical
                        key={ cat.name }
                        leftIcon={ <ChannelIcon category={ cat } /> }
                        p={ 12 }
                        gap={ 12 }
                        onPress={ () => openCategory(cat) }>
                        {cat.displayName}
                      </Button>
                    ))}
                  </View>
                </ScrollView>
              ) } />
          </TableViewSection>
        </TableView>
      </ScrollView>
    </Screen>
  );
}