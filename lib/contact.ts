import { verifyRecaptchaV2 } from './recaptcha';

export interface ContactEnv {
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
  RECAPTCHA_SECRET_KEY?: string;
}

type ContactError = 'invalid_input' | 'captcha_failed' | 'missing_config' | 'resend_failed';

function jsonResponse(success: boolean, error?: ContactError, detail?: string): Response {
  const body = success
    ? { success: true }
    : { success: false, error, ...(detail ? { detail } : {}) };

  return new Response(JSON.stringify(body), {
    status: success ? 200 : 422,
    headers: { 'Content-Type': 'application/json' },
  });
}

function respond(
  success: boolean,
  request: Request,
  error?: ContactError,
  detail?: string,
): Response {
  // /api/contact is always consumed via fetch — return JSON, not redirects
  return jsonResponse(success, error, detail);
}

function parseResendError(body: string): string | undefined {
  try {
    const parsed = JSON.parse(body) as { message?: string };
    return parsed.message;
  } catch {
    return undefined;
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseContactToEmails(value: string | undefined): string[] {
  if (!value) return [];

  return [...new Set(value.split(',').map((entry) => entry.trim()).filter((entry) => EMAIL_RE.test(entry)))];
}

function isHoneypotTriggered(formData: FormData): boolean {
  const honeypot = String(formData.get('_gotcha') || '').trim();
  return honeypot.length > 0;
}

function getRecaptchaSecret(env: ContactEnv): string | null {
  const secret = env.RECAPTCHA_SECRET_KEY?.trim();
  return secret || null;
}

async function verifyBotProtection(formData: FormData, env: ContactEnv): Promise<boolean> {
  if (isHoneypotTriggered(formData)) {
    return false;
  }

  const secret = getRecaptchaSecret(env);
  if (!secret) {
    console.error('Missing RECAPTCHA_SECRET_KEY');
    return false;
  }

  const token = String(formData.get('g-recaptcha-response') || '').trim();
  if (!token) return false;

  return await verifyRecaptchaV2(token, secret);
}

export async function handleContactPost(request: Request, env: ContactEnv): Promise<Response> {
  try {
    const formData = await request.formData();

    const name = String(formData.get('name') || '').trim().slice(0, 200);
    const company = String(formData.get('company') || '').trim().slice(0, 200);
    const email = String(formData.get('email') || '').trim().slice(0, 254);
    const message = String(formData.get('message') || '').trim().slice(0, 5000);

    if (!name || !company || !email || !message) {
      return respond(false, request, 'invalid_input');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return respond(false, request, 'invalid_input');
    }

    const botOk = await verifyBotProtection(formData, env);
    if (!botOk) {
      return respond(false, request, 'captcha_failed');
    }

    const toEmails = parseContactToEmails(env.CONTACT_TO_EMAIL);
    if (!env.RESEND_API_KEY || toEmails.length === 0) {
      console.error('Missing RESEND_API_KEY or CONTACT_TO_EMAIL');
      return respond(false, request, 'missing_config');
    }

    const from = env.CONTACT_FROM_EMAIL || 'PackRecommender <info@packrecommender.com>';

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: toEmails,
        reply_to: email,
        subject: `Contact form: ${name} from ${company}`,
        text: `Name: ${name}\nCompany: ${company}\nEmail: ${email}\n\n${message}`,
      }),
    });

    if (!resendResponse.ok) {
      const resendError = await resendResponse.text();
      const detail = parseResendError(resendError);
      console.error('Resend API error:', resendResponse.status, resendError);
      return respond(false, request, 'resend_failed', detail);
    }

    return respond(true, request);
  } catch (error) {
    console.error('Contact form error:', error);
    return respond(false, request, 'resend_failed');
  }
}
