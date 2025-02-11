import LocalizedStrings from 'react-native-localization';

import { SupportedLocale } from '~/api';
import {
  LOCALE_MAP,
  getFnsLocaleBase,
  getLocaleBase,
} from '~/core';

export * from '~/core/locales';

export const strings = new LocalizedStrings({ en: LOCALE_MAP.en });

export const getLocale = getLocaleBase(strings.getInterfaceLanguage()) as () => SupportedLocale;
export const getFnsLocale = getFnsLocaleBase(strings.getInterfaceLanguage());
