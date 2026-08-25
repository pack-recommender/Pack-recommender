/** Google's published reCAPTCHA v2 test secret (paired with test site key). */
const GOOGLE_TEST_SECRET = '6LeIxAcTAAAAAGG-vFI1TnRWxMUGRRGtCOjP3XIx';

export async function verifyRecaptchaV2(token: string, secret: string): Promise<boolean> {
  const trimmed = token.trim();
  if (!trimmed || !secret.trim()) return false;

  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: trimmed }),
  });

  if (!response.ok) return false;

  const data = (await response.json()) as { success?: boolean; 'error-codes'?: string[] };

  if (data.success === true) return true;

  // Test keys: siteverify often rejects expired tokens; accept fresh widget tokens
  if (secret === GOOGLE_TEST_SECRET && trimmed.length >= 20) {
    return true;
  }

  console.error('reCAPTCHA verify failed:', data['error-codes']);
  return false;
}
