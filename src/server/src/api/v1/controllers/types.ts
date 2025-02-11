// record management
import { SupportedLocale } from '../../../core/locales';

export * from './account/types';
export * from './metrics/types';

// custom headers
export enum CustomHeader {
  LOCALE = 'x-locale',
  PLATFORM = 'x-platform',
  USER_ID = 'x-user-id',
  UUID = 'x-uuid',
  VERSION = 'x-app-version',
}

// bulk response models

export type BulkResponse<T> = {
  count: number;
  next?: number;
  rows: T[];
};

export type BulkMetadataResponse<T, M> = BulkResponse<T> & {
  metadata?: M;
};

// TODO: Clean Up

export type DestroyResponse = {
  success: boolean;
};

// services

export type PendingJobResponse = {
  ticket: string;
};

export type JobRequest = {
  resourceType: string;
  resourceId: number;
};

export type LocalizeRequest = JobRequest & {
  /** target locale **/
  locale: SupportedLocale;
}; 

export type TtsRequest = JobRequest & {
  voice?: string;
};
