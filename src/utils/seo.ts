// SEO utility functions for multi-language support
export interface SEOData {
	title: string;
	description: string;
	keywords?: string;
}

export interface MultiLangSEO {
	zh: SEOData;
	en: SEOData;
	ja: SEOData;
}

export const seoData: Record<string, MultiLangSEO> = {
	home: {
		zh: {
			title: "首頁 - Anireki | 動畫追蹤記錄",
			description: "追蹤每季新番動畫，記錄你觀看過的所有動畫作品。輕鬆管理動畫觀看清單和歷史記錄。",
			keywords: "動畫,新番,追蹤,記錄,觀看清單,anime tracker",
		},
		en: {
			title: "Home - Anireki | Anime Tracker",
			description:
				"Track seasonal anime and record all your watched anime. Easily manage your anime watchlist and viewing history.",
			keywords: "anime,tracker,seasonal,watchlist,viewing history,collection",
		},
		ja: {
			title: "ホーム - Anireki | アニメトラッカー",
			description:
				"季節のアニメを追跡し、視聴したすべてのアニメを記録します。アニメのウォッチリストと視聴履歴を簡単に管理できます。",
			keywords: "アニメ,トラッカー,季節,ウォッチリスト,視聴履歴,コレクション",
		},
	},
	history: {
		zh: {
			title: "觀看紀錄 - Anireki",
			description: "查看你的動畫觀看歷史記錄，回顧過去看過的所有動畫作品。",
			keywords: "觀看記錄,歷史,動畫記錄,viewing history",
		},
		en: {
			title: "Watch History - Anireki",
			description: "View your anime watching history and review all the anime you've watched.",
			keywords: "watch history,viewing history,anime record,watched anime",
		},
		ja: {
			title: "視聴履歴 - Anireki",
			description: "アニメの視聴履歴を確認し、これまでに視聴したすべてのアニメを振り返ります。",
			keywords: "視聴履歴,履歴,アニメ記録,視聴したアニメ",
		},
	},
	watchlater: {
		zh: {
			title: "待看清單 - Anireki",
			description: "管理你的動畫待看清單，計劃未來要觀看的動畫作品。",
			keywords: "待看清單,計劃觀看,動畫清單,watchlist",
		},
		en: {
			title: "Watch Later - Anireki",
			description: "Manage your anime watchlist and plan future anime to watch.",
			keywords: "watchlist,plan to watch,anime list,watch later",
		},
		ja: {
			title: "後で見る - Anireki",
			description: "アニメのウォッチリストを管理し、今後視聴予定のアニメを計画します。",
			keywords: "ウォッチリスト,視聴予定,アニメリスト,後で見る",
		},
	},
};

// Get current language from various sources
export function getCurrentLanguage(): "zh" | "en" | "ja" {
	// Try to get from URL path first
	const path = window.location.pathname;
	if (path.startsWith("/en/") || path.includes("/en/")) return "en";
	if (path.startsWith("/ja/") || path.includes("/ja/")) return "ja";

	// Try to get from browser language with more precise matching
	const browserLang = navigator.language.toLowerCase();
	const userLanguages = navigator.languages || [navigator.language];

	// Check primary language codes
	for (const lang of userLanguages) {
		const langCode = lang.toLowerCase();
		if (langCode.startsWith("en")) return "en";
		if (langCode.startsWith("ja")) return "ja";
	}

	// Check for Chinese variants
	if (browserLang.includes("zh-tw") || browserLang.includes("zh-hant")) return "zh";

	// Default to Chinese for any unmatched cases
	return "zh";
}

// Update document meta tags
export function updateSEO(pageKey: string, customData?: Partial<SEOData>) {
	const lang = getCurrentLanguage();
	const data = seoData[pageKey]?.[lang] || seoData[pageKey]?.zh;

	if (!data) return;

	// Update title
	document.title = customData?.title || data.title;

	// Update or create meta description
	let descMeta = document.querySelector('meta[name="description"]') as HTMLMetaElement;
	if (!descMeta) {
		descMeta = document.createElement("meta");
		descMeta.name = "description";
		document.head.appendChild(descMeta);
	}
	descMeta.content = customData?.description || data.description;

	// Update or create meta keywords
	let keywordsMeta = document.querySelector('meta[name="keywords"]') as HTMLMetaElement;
	if (!keywordsMeta) {
		keywordsMeta = document.createElement("meta");
		keywordsMeta.name = "keywords";
		document.head.appendChild(keywordsMeta);
	}
	keywordsMeta.content = customData?.keywords || data.keywords || "";

	// Update Open Graph meta tags
	updateOGMeta("og:title", customData?.title || data.title);
	updateOGMeta("og:description", customData?.description || data.description);
	updateOGMeta("og:url", window.location.href);
}

function updateOGMeta(property: string, content: string) {
	let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
	if (!meta) {
		meta = document.createElement("meta");
		meta.setAttribute("property", property);
		document.head.appendChild(meta);
	}
	meta.content = content;
}

export function generateWebsiteSchema() {
	const schema = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: "Anireki",
		alternateName: ["アニレキ", "動畫記錄", "Anime Tracker"],
		url: "https://anireki.com",
		description:
			"Professional anime tracking platform that helps you discover seasonal anime, track your progress, and explore amazing animation works",
		inLanguage: ["zh-Hant", "en", "ja"],
		keywords: ["anime tracker", "seasonal anime", "japanese animation", "動畫追蹤", "アニメトラッカー"],
		publisher: {
			"@type": "Organization",
			name: "Anireki Team",
			url: "https://anireki.com",
		},
		copyrightHolder: {
			"@type": "Organization",
			name: "Anireki",
		},
		potentialAction: {
			"@type": "SearchAction",
			target: {
				"@type": "EntryPoint",
				urlTemplate: "https://anireki.com/search?q={search_term_string}",
			},
			"query-input": "required name=search_term_string",
		},
		sameAs: ["https://anireki.com"],
	};

	let existingScript = document.querySelector('script[type="application/ld+json"]');
	if (existingScript) {
		existingScript.textContent = JSON.stringify(schema);
	} else {
		const script = document.createElement("script");
		script.type = "application/ld+json";
		script.textContent = JSON.stringify(schema);
		document.head.appendChild(script);
	}
}
