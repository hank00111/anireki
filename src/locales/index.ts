// 支援的語言區域設定
export type SupportedLocale = 'zh-TW' | 'en' | 'ja'

// 預設語言
export const DEFAULT_LOCALE: SupportedLocale = 'zh-TW'

// 所有支援的語言列表
export const SUPPORTED_LOCALES: SupportedLocale[] = ['zh-TW', 'en', 'ja']

// 語言映射
export const LOCALE_LABELS = {
  'zh-TW': '繁體中文',
  'en': 'English',
  'ja': '日本語'
} as const
