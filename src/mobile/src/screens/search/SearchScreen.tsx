import React from 'react';
import { DeviceEventEmitter } from 'react-native';

import { Provider, Searchbar } from 'react-native-paper';

import { SearchOptionsMenu } from './SearchOptionsMenu';

import {
  InteractionType,
  PublicSummaryAttributes,
  ReadingFormat,
} from '~/api';
import {
  ActivityIndicator,
  Button,
  Screen,
  Summary,
  TabSwitcher,
  Text,
  View,
} from '~/components';
import {
  DialogContext,
  MediaContext,
  SessionContext,
  ToastContext,
} from '~/contexts';
import { useSummaryClient, useTheme } from '~/hooks';
import { ScreenProps } from '~/screens';
import { lengthOf } from '~/utils';

export function SearchScreen({ 
  route,
  navigation,
}: ScreenProps<'search'>) {
  const { 
    preferences: {
      bookmarkedCategories,
      bookmarkedOutlets,
      preferredReadingFormat,
      readSummaries,
      removedSummaries,
      sortOrder,
    },
    ready,
    setPreference,
  } = React.useContext(SessionContext);
  const toast = React.useContext(ToastContext);
  const {
    queueSummary, currentTrackIndex, preloadCount,
  } = React.useContext(MediaContext);
  const { showShareFab } = React.useContext(DialogContext);
  const { getSummaries, handleInteraction } = useSummaryClient();
  const theme = useTheme();
  
  const [prefilter, setPrefilter] = React.useState(route?.params?.prefilter ?? '');
  
  const onlyCustomNews = React.useMemo(() => Boolean(route?.params?.onlyCustomNews), [route]);

  React.useEffect(() => {
    setPrefilter(route?.params?.prefilter ?? '');
  }, [route]);
  
  React.useEffect(() => {
    navigation?.setOptions({ headerShown: false });
  }, [prefilter, navigation]);

  const [loading, setLoading] = React.useState(false);
  const [summaries, setSummaries] = React.useState<PublicSummaryAttributes[]>([]);
  const [totalResultCount, setTotalResultCount] = React.useState(0);
  const [pendingReload, setPendingReload] = React.useState(false);

  const [pageSize] = React.useState(10);
  const [page, setPage] = React.useState(0);
  const [searchText, setSearchText] = React.useState('');
  const [showSearchOptions, _] = React.useState(false);
  const [keywords, setKeywords] = React.useState<string[]>([]);
   
  const categoryOutletCount = React.useMemo(() => lengthOf(bookmarkedCategories, bookmarkedOutlets), [bookmarkedCategories, bookmarkedOutlets]);

  const followFilter = React.useMemo(() => {
    if (categoryOutletCount === 0) {
      return '';
    }
    return [`cat:${Object.values(bookmarkedCategories ?? {})
      .map((c) => c.item.name.toLowerCase().replace(/\s/g, '-')).join(',')}`, 
    `src:${Object.values(bookmarkedOutlets ?? {})
      .map((o) => o.item.name).join(',')}`]
      .join(' ');
  }, [categoryOutletCount, bookmarkedCategories, bookmarkedOutlets]);
  
  const excludeIds = React.useMemo(() => {
    if (!removedSummaries || Object.keys(removedSummaries).length === 0) {
      return undefined;
    }
    return Object.keys(removedSummaries).map((k) => Number(k));
  }, [removedSummaries]);
  
  const noResults = React.useMemo(() => onlyCustomNews && !followFilter, [onlyCustomNews, followFilter]);

  const load = React.useCallback(async (page: number) => {
    setLoading(true);
    if (page === 0) {
      setSummaries([]);
    }
    if (onlyCustomNews && !followFilter) {
      setLoading(false);
      return;
    }
    let filter = searchText;
    if (prefilter) {
      filter = [prefilter, searchText].join(' ');
    } else if (onlyCustomNews) {
      filter = [followFilter, searchText].join(' ');
    }
    try {
      const { data, error } = await getSummaries(
        filter,
        excludeIds,
        Boolean(excludeIds),
        page,
        pageSize,
        sortOrder
      );
      if (error) {
        console.error(error);
        toast.alert(error.message);
        return;
      }
      if (!data) {
        return;
      }
      setSummaries((prev) => {
        if (page === 0) {
          return (prev = data.rows);
        }
        return (prev = [...prev, ...data.rows.filter((r) => !prev.some((p) => r.id === p.id))]);
      });
      setTotalResultCount(data.count);
      setPage((prev) => prev + 1);
    } catch (e) {
      console.error(e);
      setSummaries([]);
      setTotalResultCount(0);
    } finally {
      setLoading(false);
    }
  }, [excludeIds, pageSize, onlyCustomNews, followFilter, searchText, prefilter, getSummaries, sortOrder, toast]);

  const onMount = React.useCallback(() => {
    if (!ready) {
      return;
    }
    setSearchText('');
    setPage(0);
    load(0);
    if (prefilter) {
      navigation?.setOptions({ headerShown: true, headerTitle: prefilter });
    }
  }, [load, navigation, prefilter, ready]);
  
  React.useEffect(
    () => onMount(), 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pageSize, prefilter, ready, sortOrder]
  );
  
  React.useEffect(() => {
    setSummaries((prev) => {
      const newState = prev.filter((p) => !(p.id in (removedSummaries ?? {})));
      return (prev = newState);
    });
  }, [removedSummaries]);
  
  React.useEffect(() => {
    if (!pendingReload) {
      return;
    }
    setPendingReload(false);
    load(0);
  }, [pendingReload, load, removedSummaries, searchText]);
  
  const removeReadSummaries = React.useCallback(() => {
    setPreference('removedSummaries', (prev) => (prev = ({ ...prev, ...readSummaries })));
    setPendingReload(true);
  }, [setPreference, readSummaries]);

  const loadMore = React.useCallback(async (event?: string) => {
    await load(page + 1);
    if (event) {
      DeviceEventEmitter.emit(event);
    }
  }, [load, page]);

  const handleFormatChange = React.useCallback(
    (summary: PublicSummaryAttributes, format?: ReadingFormat) => {
      handleInteraction(summary, InteractionType.Read, undefined, { format });
      navigation?.push('summary', {
        initialFormat: format ?? preferredReadingFormat ?? ReadingFormat.Summary,
        keywords: searchText ? searchText.split(' ').filter((s) => s.trim()) : [],
        summary,
      });
    },
    [handleInteraction, navigation, preferredReadingFormat, searchText]
  );

  const handlePlayAll = React.useCallback(async () => {
    if (summaries.length < 1) {
      return;
    }
    queueSummary(summaries);
    summaries.forEach((summary) => {
      handleInteraction(summary, InteractionType.Listen);
    });
  }, [summaries, queueSummary, handleInteraction]);

  const loadMoreAsNeeded = React.useCallback(async () => {
    if (!currentTrackIndex) {
      return;
    }
    if (currentTrackIndex + preloadCount > summaries.length) {
      await loadMore('autoloaded-for-track');
    }
  }, [currentTrackIndex, loadMore, preloadCount, summaries]);

  React.useEffect(() => {
    loadMoreAsNeeded();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackIndex]);
  
  React.useEffect(() => {
    const subscriber = DeviceEventEmitter.addListener('autoloaded-for-track', () => {
      queueSummary(summaries);
    });
    return () => {
      subscriber.remove();
    };
  }, [queueSummary, summaries]);
  
  const handleReferSearch = React.useCallback((newPrefilter: string) => {
    if (prefilter === newPrefilter) {
      return;
    }
    navigation?.push('search', { prefilter: newPrefilter });
  }, [navigation, prefilter]);

  return (
    <Screen
      refreshing={ loading }
      onRefresh={ () => load(0) }>
      <React.Fragment>
        <View col mh={ 16 }>
          {!prefilter && (
            <View row mb={ 8 }>
              <Provider>
                <Searchbar
                  placeholder="show me something worth reading..."
                  onChangeText={ ((text) => 
                    setSearchText(text)) }
                  inputStyle={ theme.components.searchBar }
                  value={ searchText }
                  onClearIconPress={ () => {
                    setSearchText('');
                    setKeywords([]);
                    setPendingReload(true);
                  } }
                  onSubmitEditing={ () => {
                    setKeywords(searchText.split(' ').filter((s) => s.trim()));
                    load(0);
                  } } />
                <SearchOptionsMenu visible={ showSearchOptions } anchor={ undefined } />
              </Provider>
            </View>
          )}
          <View mb={ 8 } elevated p={ 12 } rounded gap={ 12 } bg={ theme.components.card.backgroundColor }>
            <View row alignCenter gap={ 8 }>
              <TabSwitcher
                rounded
                activeTab={ sortOrder?.[0].match(/^createdAt/i) ? 1 : 0 }
                titles={ [
                  <Button
                    key='p' 
                    gap={ 4 }
                    row
                    alignCenter
                    textCenter
                    onPress={ () => {
                      setPreference(
                        'sortOrder', 
                        (prev) => prev?.[0].match(/originalDate:desc/i) ?
                          ['originalDate:asc', 'createdAt:asc'] : ['originalDate:desc', 'createdAt:desc']
                      );
                    } }
                    justifyCenter
                    endIcon={ sortOrder?.[0].match(/^originalDate/i) ? 
                      sortOrder?.[0].match(/desc/i) ? 'sort-descending' : 'sort-ascending' : undefined }>
                    Publication Date
                  </Button>,
                  <Button
                    key='g' 
                    gap={ 4 }
                    row
                    alignCenter
                    textCenter
                    onPress={ () => {
                      setPreference(
                        'sortOrder', 
                        (prev) => prev?.[0].match(/createdAt:desc/i) ?
                          ['createdAt:asc', 'originalDate:asc'] : ['createdAt:desc', 'originalDate:desc']
                      );
                    } }
                    justifyCenter
                    endIcon={ sortOrder?.[0].match(/^createdAt/i) ? 
                      sortOrder?.[0].match(/desc/i) ? 'sort-descending' : 'sort-ascending' : undefined }>
                    Generation Date
                  </Button>,
                ] } />
            </View>
            <View row>
              <Button 
                elevated
                p={ 4 }
                rounded
                onPress={ () => removeReadSummaries() }>
                Hide Already Read
              </Button>
              <View row />
              <View>
                <Button
                  row
                  elevated
                  p={ 4 }
                  rounded
                  alignCenter
                  gap={ 4 }
                  startIcon="volume-high"
                  onPress={ () => handlePlayAll() }>
                  Play All
                </Button>
              </View>
            </View>
          </View>
          {!loading && onlyCustomNews && summaries.length === 0 && (
            <View col justifyCenter p={ 16 }>
              <Text subtitle1 pb={ 8 }>
                It seems your filters are too specific. You may want to consider 
                adding more categories and/or news sources to your follow list.
              </Text>
              <Button 
                alignCenter
                rounded 
                outlined 
                p={ 8 }
                selectable
                onPress={ () => navigation?.getParent()?.navigate('Browse') }>
                Go to Browse
              </Button>
            </View>
          )}
        </View>
        {summaries.map((summary) => (
          <Summary
            key={ summary.id }
            summary={ summary }
            keywords={ showShareFab ? undefined : keywords }
            onFormatChange={ (format) => handleFormatChange(summary, format) }
            onInteract={ (...e) => handleInteraction(summary, ...e) }
            onReferSearch={ handleReferSearch } />
        ))}
        {!loading && !noResults && totalResultCount > summaries.length && (
          <View row justifyCenter p={ 16 } pb={ 24 }>
            <Button 
              outlined
              rounded
              p={ 8 }
              selectable
              onPress={ () => loadMore() }>
              Load More
            </Button>
          </View>
        )}
        {loading && (
          <View row mb={ 64 }>
            <View row justifyCenter p={ 16 } pb={ 24 }>
              <ActivityIndicator size="large" color={ theme.colors.primary } />
            </View>
          </View>
        )}
      </React.Fragment>
    </Screen>
  );
}
