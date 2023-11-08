import ms from 'ms';

import { UserData } from './UserData';

import {
  PublicCategoryAttributes,
  PublicPublisherAttributes,
  PublicSummaryGroup,
  ReadingFormat,
  RecapAttributes,
  RequestParams,
  SupportedLocale,
} from '~/api';

export type DatedEventProps = {
  createdAt: Date;
  expiresIn?: string;
};

export class DatedEvent<T> {

  item: T;
  createdAt: Date;
  expiresAt?: Date;
  
  get expired() {
    if (!this.expiresAt) {
      return false;
    }
    return new Date(this.expiresAt).valueOf() < Date.now();
  }

  constructor(item: T, {
    createdAt = new Date(), 
    expiresIn,
  }: Partial<DatedEventProps> = {}) {
    this.item = item;
    this.createdAt = createdAt;
    if (expiresIn) {
      this.expiresAt = new Date(Date.now() + ms(expiresIn));
    }
  }

}

export type ColorScheme = 'light' | 'dark' | 'system';

export enum OrientationType {
  'PORTRAIT' = 'PORTRAIT',
  'PORTRAIT-UPSIDEDOWN' = 'PORTRAIT-UPSIDEDOWN',
  'LANDSCAPE-LEFT' = 'LANDSCAPE-LEFT',
  'LANDSCAPE-RIGHT' = 'LANDSCAPE-RIGHT',
  'FACE-UP' = 'FACE-UP',
  'FACE-DOWN' = 'FACE-DOWN',
  'UNKNOWN' = 'UNKNOWN',
}

export type PushNotificationSettings = { 
  title?: string;
  body?: string;
  sound?: string;
  category?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userInfo?: { [key: string]: any };
  repeat?: string; 
  delay?: string;
  fireTime?: string; 
  scheduled?: number[];
};

export const ACTIVITY_KEYS = [
  'in-app-review',
  'in-app-review-failed',
  'set-preference',
  'localize',
  'navigate',
] as const;

export type Activity = typeof ACTIVITY_KEYS[number];

export type ResourceActivity = 
 | 'read'
 | 'unread'
 | 'hide'
 | 'unhide'
 | 'bookmark' 
 | 'unbookmark' 
 | 'follow'
 | 'unfollow'
 | 'favorite'
 | 'unfavorite'
 | 'exclude'
 | 'unexclude'
 | 'copy-to-clipboard'
 | 'intent-to-share'
 | 'save-as-image'
 | 'share-standard'
 | 'share-social'
 | 'set-preference'
 | 'report'
 | 'expand'
 | 'preview'
 | 'view-sentiment'
 | 'open-article';

export type Resource =
 | 'category'
 | 'publisher'
 | 'recap'
 | 'summary';
 
export type StorageEventName = Activity | ResourceActivity | `${ResourceActivity}-${Resource}` | `${ResourceActivity}-${Resource}-${number}` | `poll-${string}`;

export type Storage = {
  
  // system state
  latestVersion?: string;
  rotationLock?: OrientationType;  
  searchHistory?: string[];
  viewedFeatures?: { [key: string]: DatedEvent<boolean> };
  hasReviewed?: boolean;
  lastRequestForReview: number;
  
  // user state
  uuid?: string;
  pushNotificationsEnabled?: boolean;
  pushNotifications?: { [key: string]: PushNotificationSettings };
  fcmToken?: string;
  userData?: UserData;
  userStats?: UserStats;
  
  // summary state
  readSummaries?: { [key: number]: DatedEvent<boolean> };
  bookmarkedSummaries?: { [key: number]: DatedEvent<PublicSummaryGroup> };
  bookmarkCount: number;
  unreadBookmarkCount: number;
  removedSummaries?: { [key: number]: boolean };
  locale?: SupportedLocale;
  summaryTranslations?: { [key: number]: { [key in keyof PublicSummaryGroup]?: string } };
  
  // recap state
  readRecaps?: { [key: number]: boolean };
  recapTranslations?: { [key: number]: { [key in keyof RecapAttributes]?: string } };
  
  // followed publishers
  followedPublishers?: { [key: string]: boolean };
  favoritedPublishers?: { [key: string]: boolean }; 
  excludedPublishers?: { [key: string]: boolean };
  
  // followed categories
  followedCategories?: { [key: string]: boolean };
  favoritedCategories?: { [key: string]: boolean };
  excludedCategories?: { [key: string]: boolean };
  
  followCount: number;
  followFilter?: string;
  excludeFilter?: string;
  
  // system preferences
  colorScheme?: ColorScheme;
  fontFamily?: string;
  fontSizeOffset?: number;
  letterSpacing?: number;
  lineHeightMultiplier?: number;
  
  // display preferences
  compactSummaries?: boolean;
  showShortSummary?: boolean;
  preferredShortPressFormat?: ReadingFormat;
  preferredReadingFormat?: ReadingFormat;
  sentimentEnabled?: boolean;
  triggerWords?: { [key: string]: string };
};

export const STORAGE_TYPES: { [key in keyof Storage]: 'boolean' | 'number' | 'string' | 'object' | 'array' } = {
  bookmarkCount: 'number',
  bookmarkedSummaries: 'object',
  colorScheme: 'string',
  compactSummaries: 'boolean',
  excludeFilter: 'string',
  excludedCategories: 'object',
  excludedPublishers: 'object',
  favoritedCategories: 'object',
  favoritedPublishers: 'object',
  fcmToken: 'string',
  followCount: 'number',
  followFilter: 'string',
  followedCategories: 'object',
  followedPublishers: 'object',
  fontFamily: 'string',
  fontSizeOffset: 'number',
  hasReviewed: 'boolean',
  lastRequestForReview: 'number',
  letterSpacing: 'number',
  lineHeightMultiplier: 'number',
  locale: 'string',
  preferredReadingFormat: 'string',
  preferredShortPressFormat: 'string',
  pushNotifications: 'object',
  pushNotificationsEnabled: 'boolean',
  readRecaps: 'object',
  readSummaries: 'object',
  recapTranslations: 'object',
  removedSummaries: 'object',
  rotationLock: 'boolean',
  searchHistory: 'array',
  sentimentEnabled: 'boolean',
  showShortSummary: 'boolean',
  summaryTranslations: 'object',
  triggerWords: 'object',
  unreadBookmarkCount: 'number',
  userData: 'object',
  userStats: 'object',
  uuid: 'string',
  viewedFeatures: 'object',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FunctionWithRequestParams<T extends any[], R> = ((...args: [...T, RequestParams]) => R);

export type PreferenceMutation<E extends StorageEventName> =
  E extends `${string}-summary` ? PublicSummaryGroup :
  E extends `${string}-recap` ? RecapAttributes :
  E extends `${string}-publisher` ? PublicPublisherAttributes :
  E extends `${string}-category` ? PublicCategoryAttributes :
  E extends `in-app-review-${string}` ? string :
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any;
  
export type PreferenceState<E extends StorageEventName> =
  E extends `${'unbookmark' | 'bookmark'}-summary` ? Storage['bookmarkedSummaries'] :
  E extends `${'read' | 'unread'}-summary` ? Storage['readSummaries'] :
  E extends `${'read' | 'unread'}-recap` ? Storage['readRecaps'] :
  E extends `${string}-summary` ? Storage['removedSummaries'] :
  E extends `${string}-publisher` ? Storage['followedPublishers'] :
  E extends `${string}-category` ? Storage['followedCategories'] :
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any;

export type Streak = {
  start: Date;
  end: Date;
  length: number;
};

export type UserStats = {
  lastSeen?: Date;
  streak?: Streak;
  longestStreak?: Streak;
};

export type StorageContextType = Storage & {
  ready?: boolean;

  loadedInitialUrl?: boolean;
  setLoadedInitialUrl: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  categories?: Record<string, PublicCategoryAttributes>;
  setCategories: React.Dispatch<React.SetStateAction<Record<string, PublicCategoryAttributes> | undefined>>;
  publishers?: Record<string, PublicPublisherAttributes>;
  setPublishers: React.Dispatch<React.SetStateAction<Record<string, PublicPublisherAttributes> | undefined>>;

  userStats?: UserStats;

  // state setters
  setStoredValue: <K extends keyof Storage, V extends Storage[K] | ((value?: Storage[K]) => (Storage[K] | undefined))>(key: K, value?: V, emit?: boolean) => Promise<void>;
  getStoredValue: <K extends keyof Storage>(key: K) => Promise<Storage[K] | undefined>;
  resetStorage: (hard?: boolean) => Promise<void>;
  storeTranslations: <
    Target extends RecapAttributes | PublicSummaryGroup, 
    StoredValueKey extends Target extends RecapAttributes ? 'recapTranslations' : Target extends PublicSummaryGroup ? 'summaryTranslations' : never
  >(item: Target, translations: { [key in keyof Target]?: string }, prefKey: StoredValueKey) => Promise<void>;
  hasPushEnabled: (key: string) => boolean;
  enablePush: (key: string, settings?: PushNotificationSettings) => Promise<void>;
  hasViewedFeature: (...features: string[]) => boolean;
  viewFeature: (feature: string, state?: boolean) => Promise<void>;
  
  // summary convenience functions
  bookmarkSummary: (summary: PublicSummaryGroup) => Promise<void>;
  readSummary: (summary: PublicSummaryGroup, force?: boolean) => Promise<void>;
  removeSummary: (summary: PublicSummaryGroup) => Promise<void>;
  
  // recap convenience functions
  readRecap: (recap: RecapAttributes, force?: boolean) => Promise<void>;
  
  // follow publisher convenience functions
  followPublisher: (publisher: PublicPublisherAttributes) => Promise<void>;
  isFollowingPublisher: (publisher: PublicPublisherAttributes) => boolean;
  favoritePublisher: (publisher: PublicPublisherAttributes) => Promise<void>;
  publisherIsFavorited: (publisher: PublicPublisherAttributes) => boolean;
  excludePublisher: (publisher: PublicPublisherAttributes) => Promise<void>;
  isExcludingPublisher: (publisher: PublicPublisherAttributes) => boolean;

  // follow category convenience functions
  followCategory: (category: PublicCategoryAttributes) => Promise<void>;
  isFollowingCategory: (publisher: PublicCategoryAttributes) => boolean;
  favoriteCategory: (category: PublicCategoryAttributes) => Promise<void>;
  categoryIsFavorited: (category: PublicCategoryAttributes) => boolean;
  excludeCategory: (category: PublicCategoryAttributes) => Promise<void>;
  isExcludingCategory: (publisher: PublicCategoryAttributes) => boolean;
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  withHeaders: <T extends any[], R>(fn: FunctionWithRequestParams<T, R>) => ((...args: T) => R);
};

export const DEFAULT_STORAGE_CONTEXT: StorageContextType = {
  bookmarkCount: 0,
  bookmarkSummary: () => Promise.resolve(),
  categoryIsFavorited: () => false,
  enablePush: () => Promise.resolve(),
  excludeCategory: () => Promise.resolve(),
  excludePublisher: () => Promise.resolve(),
  favoriteCategory: () => Promise.resolve(),
  favoritePublisher: () => Promise.resolve(),
  followCategory: () => Promise.resolve(),
  followCount: 0,
  followFilter: '',
  followPublisher: () => Promise.resolve(),
  getStoredValue: () => Promise.resolve(undefined),
  hasPushEnabled: () => false,
  hasViewedFeature: () => false,
  isExcludingCategory: () => false,
  isExcludingPublisher: () => false,
  isFollowingCategory: () => false,
  isFollowingPublisher: () => false,
  lastRequestForReview: 0,
  publisherIsFavorited: () => false,
  readRecap: () => Promise.resolve(),
  readSummary: () => Promise.resolve(),
  removeSummary: () => Promise.resolve(),
  resetStorage: () => Promise.resolve(),
  setCategories: () => Promise.resolve(),
  setLoadedInitialUrl: () => Promise.resolve(),
  setPublishers: () => Promise.resolve(),
  setStoredValue: () => Promise.resolve(),
  storeTranslations: () => Promise.resolve(undefined),
  unreadBookmarkCount: 0,
  viewFeature: () => Promise.resolve(),
  withHeaders: (fn) => (...args) => fn(...args, {}),
};