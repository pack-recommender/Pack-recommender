/** Shared maintenance helpers for Cloudflare middleware and Astro pages. */
export const BYPASS_STORAGE_KEY = 'testValue';
export const BYPASS_QUERY_PARAM = 'test';

export function getTodayBypassCode(date = new Date()): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}${month}${year}`;
}

export function isValidBypass(testValue: string | null | undefined, date = new Date()): boolean {
  return Boolean(testValue && testValue === getTodayBypassCode(date));
}

export function getMaintenancePath(pathname: string): string {
  return pathname.startsWith('/he') ? '/he/maintenance' : '/maintenance';
}

export function isMaintenancePath(pathname: string): boolean {
  return pathname === '/maintenance' || pathname === '/he/maintenance';
}

export function isMaintenanceAssetPath(pathname: string): boolean {
  return (
    pathname.startsWith('/_astro') ||
    pathname.startsWith('/fonts/') ||
    pathname.startsWith('/img/') ||
    pathname.startsWith('/api/') ||
    /\.(ico|gif|png|jpg|jpeg|webp|woff2|css|js|xml|txt|svg)$/i.test(pathname)
  );
}

export function parseCookies(header: string): Record<string, string> {
  return Object.fromEntries(
    header
      .split(';')
      .map((part) => part.trim().split('='))
      .filter(([key]) => key)
      .map(([key, ...value]) => [key, value.join('=')]),
  );
}
