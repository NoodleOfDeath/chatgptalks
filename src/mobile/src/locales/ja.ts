import { enStrings } from './en';

export const jaStrings: typeof enStrings = {
  actions: { close: '閉じる' },
  bookmarks: {
    activity: 'アクティビティ',
    bookmarks: 'ブックマーク',
    bookmarksDetail: 'ブックマークは常にオフラインで利用可能です',
    bookmarksNote: '注意: 元の記事自体はオフラインで保存されません',
    removeReadFromBookmarks: 'ブックマークから読み取りを削除',
  },
  browse: '閲覧',
  categories: 'カテゴリ',
  category: 'カテゴリ',
  channels: 'チャンネル',
  clearSearchHistory: '検索履歴をクリア',
  clearSelection: '選択をクリア',
  feedback: {
    feedback: 'フィードバック',
    options: {
      helpful: 'この要約は実際に役立ちます',
      imageIrrelevant: 'この画像は関連性がありません',
      imageOffensive: 'この画像は攻撃的です',
      inaccurate: 'これは不正確です',
      incorrectSentiment: 'この要約は感情が正しくありません',
      notNews: 'これはニュースではありません',
      offensive: 'これは攻撃的です',
      other: 'その他',
      spam: 'これはスパムです',
      tooLong: 'この要約は長すぎます',
      tooShort: 'この要約は短すぎます',
      wrongCategory: 'これは間違ったカテゴリです',
    },
    sorry: 'ご不便をおかけして申し訳ありません。この投稿はもう表示されません',
    submit: 'フィードバックを送信',
    thankYou: 'フィードバックありがとうございます！',
  },
  follow: 'フォロー',
  followChannel: 'チャンネルをフォロー',
  headlines: 'ヘッドライン',
  inTheLast: '過去',
  myNews: 'マイニュース',
  newsSource: 'ニュースソース',
  readless: '簡略表示', search: {
    customNewsSearch: '注意：これはカスタムニュースフィード内のみを検索しており、すべてのニュース記事を対象としていません',
    filtersTooSpecific: 'フィルタがあまりにも具体的すぎるようです。より多くのカテゴリやニュースソースをフォローリストに追加することを検討してください',
    goToBrowse: '閲覧へ移動',
    loadMore: 'もっと読み込む',
    loading: '読み込み中',
    noResults: '結果が見つかりません',
    reload: '再読み込み',
    results: '結果',
    search: '検索',
  },
  settings: {
    clearCache: 'キャッシュをクリア',
    clearHistory: '履歴をクリア',
    colorScheme: 'カラースキーム',
    compact: 'コンパクト',
    dark: 'ダーク',
    defaultReadingMode: '開くときのデフォルトの表示モード',
    displayMode: '表示モード',
    expanded: '展開',
    font: 'フォント',
    light: 'ライト',
    resetHiddenSummaries: '非表示の要約をリセット',
    resetReadSummaries: '未読の要約にリセット',
    settings: '設定',
    shortSummaries: 'タイトルの下に短い要約',
    shortSummariesInsteadOfTitles: 'タイトルの代わりに短い要約',
    system: 'システム',
    textScale: 'テキストの拡大縮小',
  },
  summary: {
    bullets: '箇条書き',
    hide: '非表示',
    markAsRead: '既読としてマーク',
    markAsUnRead: '未読としてマーク',
    negative: 'ネガティブ',
    neutral: '中立',
    positive: 'ポジティブ',
    reportAtBug: 'バグを報告',
    sentimentAnalysis: '感情分析',
    sentimentAnalysisInfo: '感情分析は、人々の言語を分析することによって、何についての感情を人々が持っているかを理解するのに役立つツールです。人々が使用する言葉を調べ、それがポジティブ、ネガティブ、または中立かを判断します。これは、顧客のフィードバックや特定のトピックに対する一般の意見を理解するために役立ちます。',
    showOriginalText: '元のテキストを表示',
    showTranslatedText: '翻訳されたテキストを表示',
    summary: '要約',
    summaryBullets: '要約/箇条書き',
    thisIsNotARealImage: 'この画像はAIを使用して生成されたものであり、実際のイベント、場所、物事、人物の写真ではありません。',
    translate: '翻訳',
    veryNegative: '非常にネガティブ',
    veryPositive: '非常にポジティブ',
  },
  unfollow: 'フォロー解除',
  unfollowChannel: 'チャンネルのフォロー解除',
};
