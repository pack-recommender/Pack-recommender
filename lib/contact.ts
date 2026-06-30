export interface ContactEnv {
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
}

type ContactError = 'invalid_input' | 'missing_config' | 'resend_failed';

function getReturnPath(locale: string, status: 'sent' | 'error'): string {
  const base = locale === 'he' ? '/he' : '/';
  const param = status === 'sent' ? 'sent=1' : 'error=1';
  return `${base}?${param}#contact`;
}

function wantsJson(request: Request): boolean {
  const accept = request.headers.get('Accept') || '';
  return accept.includes('application/json');
}

function redirect(path: string): Response {
  return new Response(null, {
    status: 303,
    headers: { Location: path },
  });
}

function jsonResponse(success: boolean, error?: ContactError): Response {
  return new Response(JSON.stringify(success ? { success: true } : { success: false, error }), {
    status: success ? 200 : 422,
    headers: { 'Content-Type': 'application/json' },
  });
}

function respond(
  success: boolean,
  locale: string,
  request: Request,
  error?: ContactError,
): Response {
  return wantsJson(request)
    ? jsonResponse(success, error)
    : redirect(getReturnPath(locale, success ? 'sent' : 'error'));
}

export async function handleContactPost(request: Request, env: ContactEnv): Promise<Response> {
  let locale = 'en';

  try {
    const formData = await request.formData();
    locale = String(formData.get('locale') || 'en');

    const name = String(formData.get('name') || '').trim().slice(0, 200);
    const company = String(formData.get('company') || '').trim().slice(0, 200);
    const email = String(formData.get('email') || '').trim().slice(0, 254);
    const message = String(formData.get('message') || '').trim().slice(0, 5000);

    if (!name || !company || !email || !message) {
      return respond(false, locale, request, 'invalid_input');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return respond(false, locale, request, 'invalid_input');
    }

    if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL) {
      console.error('Missing RESEND_API_KEY or CONTACT_TO_EMAIL');
      return respond(false, locale, request, 'missing_config');
    }

    const from = env.CONTACT_FROM_EMAIL || 'PackRecommender <onboarding@resend.dev>';

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [env.CONTACT_TO_EMAIL],
        reply_to: email,
        subject: `Contact form: ${name} from ${company}`,
        text: `Name: ${name}\nCompany: ${company}\nEmail: ${email}\n\n${message}`,
      }),
    });

    if (!resendResponse.ok) {
      const resendError = await resendResponse.text();
      console.error('Resend API error:', resendResponse.status, resendError);
      return respond(false, locale, request, 'resend_failed');
    }

    return respond(true, locale, request);
  } catch (error) {
    console.error('Contact form error:', error);
    return respond(false, locale, request, 'resend_failed');
  }
}
