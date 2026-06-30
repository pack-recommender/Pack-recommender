export interface ContactEnv {
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
}

function getReturnPath(locale: string, status: 'sent' | 'error'): string {
  const base = locale === 'he' ? '/he' : '/';
  const param = status === 'sent' ? 'sent=1' : 'error=1';
  return `${base}?${param}#contact`;
}

function redirect(path: string): Response {
  return new Response(null, {
    status: 303,
    headers: { Location: path },
  });
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
      return redirect(getReturnPath(locale, 'error'));
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return redirect(getReturnPath(locale, 'error'));
    }

    if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL) {
      console.error('Missing RESEND_API_KEY or CONTACT_TO_EMAIL');
      return redirect(getReturnPath(locale, 'error'));
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
      console.error('Resend API error:', await resendResponse.text());
      return redirect(getReturnPath(locale, 'error'));
    }

    return redirect(getReturnPath(locale, 'sent'));
  } catch (error) {
    console.error('Contact form error:', error);
    return redirect(getReturnPath(locale, 'error'));
  }
}
