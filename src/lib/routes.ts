// Route definitions
export const routes = {
  home: '/',
  about: '#about',
  features: '#features',
  contact: '#contact',
  login: process.env.NEXT_PUBLIC_LOGIN_URL || '/login',
  demo: process.env.NEXT_PUBLIC_DEMO_URL || 'https://calendly.com/marktulloch/ai',
  /** Anchor for overview section with demo video */
  overview: '#overview',
} as const;

/** YouTube demo video ID (from watch URL: youtube.com/watch?v=THIS_PART). Replace with your demo video ID. */
const DEMO_VIDEO_ID = 'kXODTFdT4Rc';
export const youtubeDemoVideoId =
  process.env.NEXT_PUBLIC_YOUTUBE_DEMO_VIDEO_ID || DEMO_VIDEO_ID;

// Helper to check if a URL is external (http/https)
export function isExternalUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}
