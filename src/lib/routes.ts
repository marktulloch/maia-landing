// Route definitions
export const routes = {
  home: '/',
  about: '#about',
  features: '#features',
  contact: '#contact',
  articles: '/articles',
  login: process.env.NEXT_PUBLIC_LOGIN_URL || '/login',
  demo: process.env.NEXT_PUBLIC_DEMO_URL || 'https://calendly.com/marktulloch/ai',
  /** Anchor for overview section with demo video */
  overview: '#overview',
  /** Admin CMS */
  adminArticles: '/admin/articles',
  adminArticlesNew: '/admin/articles/new',
  adminArticleEdit: (id: string) => `/admin/articles/edit/${id}`,
} as const;

/** YouTube demo video ID (from watch URL: youtube.com/watch?v=THIS_PART). Replace with your demo video ID. */
const DEMO_VIDEO_ID = 'kXODTFdT4Rc';
export const youtubeDemoVideoId =
  process.env.NEXT_PUBLIC_YOUTUBE_DEMO_VIDEO_ID || DEMO_VIDEO_ID;

// Helper to check if a URL is external (http/https)
export function isExternalUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}

/** Base URL for the site (e.g. https://maia.example.com). Set NEXT_PUBLIC_SITE_URL for canonical URLs and sitemaps. */
export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.trim() || '';
}
