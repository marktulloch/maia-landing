// Route definitions
export const routes = {
  home: '/',
  about: '#about',
  features: '#features',
  contact: '#contact',
  login: process.env.NEXT_PUBLIC_LOGIN_URL || '/login',
  demo: process.env.NEXT_PUBLIC_DEMO_URL || '#contact',
} as const;

// Helper to check if a URL is external (http/https)
export function isExternalUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}
