import { handleContactPost } from '../lib/contact';
import {
  BYPASS_QUERY_PARAM,
  BYPASS_STORAGE_KEY,
  getMaintenancePath,
  isMaintenanceAssetPath,
  isMaintenancePath,
  isValidBypass,
  parseCookies,
} from '../lib/maintenance';

interface Env {
  ASSETS: Fetcher;
  MAINTENANCE_MODE?: string;
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    if (pathname === '/api/contact' && request.method === 'POST') {
      return handleContactPost(request, env);
    }

    if (!isMaintenancePath(pathname) && !isMaintenanceAssetPath(pathname)) {
      const maintenanceEnabled = env.MAINTENANCE_MODE !== 'false';
      if (maintenanceEnabled) {
        const cookies = parseCookies(request.headers.get('Cookie') || '');
        const queryTest = url.searchParams.get(BYPASS_QUERY_PARAM);
        const cookieTest = cookies[BYPASS_STORAGE_KEY];
        const testValue = queryTest || cookieTest || '';

        if (!isValidBypass(testValue)) {
          return Response.redirect(new URL(getMaintenancePath(pathname), url.origin), 302);
        }

        if (queryTest && isValidBypass(queryTest)) {
          const response = await env.ASSETS.fetch(request);
          const nextResponse = new Response(response.body, response);
          nextResponse.headers.append(
            'Set-Cookie',
            `${BYPASS_STORAGE_KEY}=${queryTest}; Path=/; Max-Age=86400; SameSite=Lax`,
          );
          return nextResponse;
        }
      }
    }

    return env.ASSETS.fetch(request);
  },
};
