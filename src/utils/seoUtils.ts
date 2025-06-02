import type { SupportedLocale } from '@/locales'


export function generateAnimeJsonLd(anime: {
  id: string
  title: string
  title_jp: string
  description?: string
  images_url?: string
  season?: string
  media?: string
  startDate?: string
  copyright?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    "name": anime.title || anime.title_jp,
    "alternateName": anime.title_jp,
    "description": anime.description || `${anime.title || anime.title_jp} - 日本動畫作品`,
    "image": anime.images_url,
    "genre": "Animation",
    "inLanguage": "ja",
    "countryOfOrigin": {
      "@type": "Country",
      "name": "Japan"
    },
    "productionCompany": anime.copyright,
    "datePublished": anime.startDate,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.5",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "100"
    },
    "url": `https://anireki.com/works/${anime.id}`,
    "sameAs": [
      `https://anireki.com/works/${anime.id}`
    ]
  }
}

/**
 * 生成網站的麵包屑結構化數據
 */
export function generateBreadcrumbJsonLd(items: Array<{name: string, url: string}>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }
}

/**
 * 生成搜尋框結構化數據
 */
export function generateSearchBoxJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://anireki.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://anireki.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }
}


export function optimizeMetaDescription(text: string, maxLength: number = 160): string {
  const cleanText = text.replace(/<[^>]*>/g, '')
  
  if (cleanText.length <= maxLength) {
    return cleanText
  }
  
  const truncated = cleanText.slice(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  const lastPeriod = truncated.lastIndexOf('。')
  
  const cutPoint = Math.max(lastSpace, lastPeriod)
  
  if (cutPoint > maxLength * 0.8) {
    return cleanText.slice(0, cutPoint) + '...'
  }
  
  return truncated + '...'
}

export function generateSeasonTitle(year: number, season: string): string {
  const seasonNames: Record<string, string> = {
    'winter': '冬季',
    'spring': '春季', 
    'summer': '夏季',
    'autumn': '秋季'
  }
  
  const seasonName = seasonNames[season.toLowerCase()] || season
  return `${year}年${seasonName}新番 - Anireki | 最新動畫作品推薦`
}

export function generateSeasonDescription(year: number, season: string): string {
  const seasonNames: Record<string, string> = {
    'winter': '冬季',
    'spring': '春季',
    'summer': '夏季', 
    'autumn': '秋季'
  }
  
  const seasonName = seasonNames[season.toLowerCase()] || season
  return `探索${year}年${seasonName}最新動畫作品，包含人氣新番推薦、播放時間表和詳細資訊。立即在 Anireki 開始追番！`
}


export async function validateImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    return response.ok && response.headers.get('content-type')?.startsWith('image/') === true
  } catch {
    return false
  }
}


export function getDefaultOgImage(): string {
  return 'https://p2.anireki.com/og-image.jpg'
}


export function sanitizeUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.toString()
  } catch {
    return `https://anireki.com${url.startsWith('/') ? '' : '/'}${url}`
  }
}

export function generateHreflangTags(currentPath: string): Array<{rel: string, hreflang: string, href: string}> {
  const baseUrl = 'https://anireki.com'
  const locales: SupportedLocale[] = ['zh-TW', 'en', 'ja']
  
  return locales.map(locale => ({
    rel: 'alternate',
    hreflang: locale,
    href: `${baseUrl}/${locale}${currentPath}`
  }))
}

/**
 * 根據語言生成適當的 meta description
 */
export function getLocalizedMetaDescription(
  locale: SupportedLocale, 
  type: 'home' | 'history' | 'watchLater' | 'anime' = 'home'
): string {
  const descriptions: Record<SupportedLocale, Record<'home' | 'history' | 'watchLater' | 'anime', string>> = {
    'zh-TW': {
      home: '專業的動畫觀看記錄平台，讓您輕鬆追蹤每季新番，記錄觀看進度，發現更多精彩動畫作品。',
      history: '查看您的動畫觀看歷史記錄，追蹤已完成的作品和觀看進度。',
      watchLater: '管理您的動畫待看清單，收藏想要觀看的精彩作品。',
      anime: '探索精彩的日本動畫作品，包含詳細資訊、評價和觀看記錄。'
    },
    'en': {
      home: 'Professional anime tracking platform that helps you discover seasonal anime, track your progress, and explore amazing animation works.',
      history: 'View your anime watching history and track your completed series and progress.',
      watchLater: 'Manage your anime watchlist and save series you want to watch.',
      anime: 'Explore amazing Japanese anime series with detailed information, ratings, and tracking features.'
    },
    'ja': {
      home: 'プロのアニメ視聴記録プラットフォームで、シーズンアニメの発見、視聴進度の追跡、素晴らしいアニメ作品の探索が簡単にできます。',
      history: 'アニメの視聴履歴を確認し、完了した作品と視聴進度を追跡します。',
      watchLater: 'アニメの視聴予定リストを管理し、見たい作品を保存します。',
      anime: '詳細情報、評価、追跡機能を備えた素晴らしい日本のアニメシリーズを探索しましょう。'
    }
  }
  
  return descriptions[locale][type]
}


export function getLocalizedKeywords(locale: SupportedLocale, type: 'home' | 'history' | 'watchLater' | 'anime' = 'home'): string {
  const keywords: Record<SupportedLocale, Record<'home' | 'history' | 'watchLater' | 'anime', string>> = {
    'zh-TW': {
      home: '動畫觀看記錄,季番追蹤,日本動畫,anime,番劇清單,動漫記錄,新番推薦,動畫資料庫',
      history: '動畫觀看記錄,觀看歷史,追番記錄,動畫進度',
      watchLater: '動畫待看清單,收藏動畫,想看動畫,番劇收藏',
      anime: '日本動畫,動畫資訊,動畫評價,動畫追蹤'
    },
    'en': {
      home: 'anime tracker,seasonal anime,japanese animation,anime database,watch history,anime list,otaku',
      history: 'anime watch history,completed anime,anime progress,tracking',
      watchLater: 'anime watchlist,plan to watch,anime backlog,save anime',
      anime: 'japanese anime,anime information,anime rating,anime tracking'
    },
    'ja': {
      home: 'アニメ視聴記録,シーズンアニメ,日本アニメ,アニメデータベース,視聴履歴,アニメリスト',
      history: 'アニメ視聴履歴,完了アニメ,アニメ進度,トラッキング',
      watchLater: 'アニメ視聴予定,見たいアニメ,アニメコレクション,アニメ保存',
      anime: '日本アニメ,アニメ情報,アニメ評価,アニメ追跡'
    }
  }
  
  return keywords[locale][type]
}

export function generateMultilingualAnimeJsonLd(anime: {
  id: string
  title: string
  title_jp: string
  description?: string
  images_url?: string
  season?: string
  media?: string
  startDate?: string
  copyright?: string
}, locale: SupportedLocale) {
  const baseSchema = generateAnimeJsonLd(anime)
    const localizedContent: Record<SupportedLocale, { name: string; description: string; inLanguage: string }> = {
    'zh-TW': {
      name: anime.title || anime.title_jp,
      description: anime.description || `${anime.title || anime.title_jp} - 日本動畫作品`,
      inLanguage: 'ja'
    },
    'en': {
      name: anime.title || anime.title_jp,
      description: anime.description || `${anime.title || anime.title_jp} - Japanese Anime Series`,
      inLanguage: 'ja'
    },
    'ja': {
      name: anime.title_jp || anime.title,
      description: anime.description || `${anime.title_jp || anime.title} - 日本のアニメ作品`,
      inLanguage: 'ja'
    }
  }
  
  return {
    ...baseSchema,
    ...localizedContent[locale],
    url: `https://anireki.com/${locale}/works/${anime.id}`,
    sameAs: [
      `https://anireki.com/zh-TW/works/${anime.id}`,
      `https://anireki.com/en/works/${anime.id}`,
      `https://anireki.com/ja/works/${anime.id}`
    ]
  }
}


export function generateMultilingualWebsiteJsonLd(locale: SupportedLocale) {  const content: Record<SupportedLocale, { name: string; description: string; inLanguage: string }> = {
    'zh-TW': {
      name: 'Anireki',
      description: '專業的動畫觀看記錄平台',
      inLanguage: 'zh-TW'
    },
    'en': {
      name: 'Anireki',
      description: 'Professional Anime Tracking Platform',
      inLanguage: 'en'
    },
    'ja': {
      name: 'Anireki',
      description: 'プロのアニメ視聴記録プラットフォーム',
      inLanguage: 'ja'
    }
  }
  
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    ...content[locale],
    url: `https://anireki.com/${locale}`,
    potentialAction: {
      "@type": "SearchAction",
      target: `https://anireki.com/${locale}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    },
    sameAs: [
      "https://anireki.com/zh-TW",
      "https://anireki.com/en", 
      "https://anireki.com/ja"
    ]
  }
}
