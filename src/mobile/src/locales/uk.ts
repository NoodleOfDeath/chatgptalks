import { enStrings } from './en';

export const ukStrings: typeof enStrings = {
  actions: { close: 'Закрити' },
  bookmarks: {
    activity: 'Активність',
    bookmarks: 'Закладки',
    bookmarksDetail: 'Закладки завжди доступні офлайн',
    bookmarksNote: 'Примітка: Оригінальні статті не зберігаються для офлайн-читання',
    removeReadFromBookmarks: 'Видалити читання з закладок',
  },
  browse: 'Перегляд',
  categories: 'Категорії',
  category: 'Категорія',
  channels: 'Канали',
  clearSearchHistory: 'Очистити історію пошуку',
  clearSelection: 'Очистити вибір',
  feedback: {
    feedback: 'Зворотній зв\'язок',
    options: {
      helpful: 'Цей підсумок насправді корисний',
      imageIrrelevant: 'Це зображення не відноситься до контексту',
      imageOffensive: 'Це образливе зображення',
      inaccurate: 'Це недостовірно',
      incorrectSentiment: 'Цей підсумок має неправильний настрій',
      notNews: 'Це не новини',
      offensive: 'Це образливо',
      other: 'Інше',
      spam: 'Це спам',
      tooLong: 'Цей підсумок занадто довгий',
      tooShort: 'Цей підсумок занадто короткий',
      wrongCategory: 'Це знаходиться у неправильній категорії',
    },
    sorry: 'Вибачте за незручності. Цей пост більше не буде відображатись для вас',
    submit: 'Надіслати відгук',
    thankYou: 'Дякуємо за ваш відгук!',
  },
  follow: 'Стежити',
  followChannel: 'Стежити за каналом',
  headlines: 'Заголовки',
  inTheLast: 'за останні',
  myNews: 'Мої новини',
  newsSource: 'Джерело новин',
  readless: 'Читати менше', 
  search: {
    customNewsSearch: 'Примітка: Це шукає лише у вашому власному каналі новин і не в усіх новинних статтях',
    filtersTooSpecific: 'Здається, ваші фільтри дуже конкретні. Розгляньте можливість додати більше категорій та/або джерел новин до вашого списку підписки',
    goToBrowse: 'Перейти до Перегляду',
    loadMore: 'Завантажити ще',
    loading: 'Завантаження',
    noResults: 'Результати не знайдені',
    reload: 'Перезавантажити',
    results: 'Результати',
    search: 'Пошук',
  },
  settings: {
    clearCache: 'Очистити кеш',
    clearHistory: 'Очистити історію',
    colorScheme: 'Кольорова схема',
    compact: 'Компактний',
    dark: 'Темний',
    defaultReadingMode: 'Режим читання за замовчуванням',
    displayMode: 'Режим відображення',
    expanded: 'Розгорнутий',
    font: 'Шрифт',
    light: 'Світлий',
    resetHiddenSummaries: 'Скинути сховані підсумки',
    resetReadSummaries: 'Скинути підсумки на непрочитані',
    settings: 'Налаштування',
    shortSummaries: 'Короткі підсумки під заголовками',
    shortSummariesInsteadOfTitles: 'Короткі резюме замість заголовків',
    system: 'Система',
    textScale: 'Масштаб тексту',
  },
  summary: {
    bullets: 'Маркери',
    hide: 'Приховати',
    markAsRead: 'Позначити як прочитане',
    markAsUnRead: 'Позначити як непрочитане',
    negative: 'Негативний',
    neutral: 'Нейтральний',
    positive: 'Позитивний',
    reportAtBug: 'Повідомити про помилку',
    sentimentAnalysis: 'Аналіз настроїв',
    sentimentAnalysisInfo: 'Аналіз настроїв - це інструмент, який допомагає розуміти, як люди ставляться до чогось, аналізуючи їх мову. Він досліджує слова, якими користуються люди, і визначає, чи є вони позитивними, негативними чи нейтральними. Це може бути корисним в багатьох галузях, наприклад, для розуміння відгуків клієнтів або громадської думки про певну тему.',
    showOriginalText: 'Показати початковий текст',
    showTranslatedText: 'Показати перекладений текст',
    summary: 'Підсумок',
    summaryBullets: 'Підсумок/Маркери',
    thisIsNotARealImage: 'Це зображення було згенеровано за допомогою штучного інтелекту і не є реальною фотографією реальної події, місця, речі або особи.',
    translate: 'Перекласти',
    veryNegative: 'Дуже негативний',
    veryPositive: 'Дуже позитивний',
  },
  unfollow: 'Припинити слідкування',
  unfollowChannel: 'Припинити слідкування за каналом',
};
