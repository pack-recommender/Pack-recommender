import {
  BYPASS_QUERY_PARAM,
  BYPASS_STORAGE_KEY,
  getMaintenancePath,
  getTodayBypassCode,
  isMaintenanceAssetPath,
  isMaintenancePath,
  isValidBypass,
  parseCookies,
} from '../lib/maintenance';

interface Env {
  MAINTENANCE_MODE?: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const { pathname } = url;

  if (isMaintenancePath(pathname) || isMaintenanceAssetPath(pathname)) {
    return context.next();
  }

  const maintenanceEnabled = context.env.MAINTENANCE_MODE !== 'false';
  if (!maintenanceEnabled) {
    return context.next();
  }

  const cookies = parseCookies(context.request.headers.get('Cookie') || '');
  const queryTest = url.searchParams.get(BYPASS_QUERY_PARAM);
  const cookieTest = cookies[BYPASS_STORAGE_KEY];
  const testValue = queryTest || cookieTest || '';

  if (isValidBypass(testValue)) {
    if (queryTest && isValidBypass(queryTest)) {
      const response = await context.next();
      const nextResponse = new Response(response.body, response);
      nextResponse.headers.append(
        'Set-Cookie',
        `${BYPASS_STORAGE_KEY}=${queryTest}; Path=/; Max-Age=86400; SameSite=Lax`,
      );
      return nextResponse;
    }
    return context.next();
  }

  return Response.redirect(new URL(getMaintenancePath(pathname), url.origin), 302);
};
