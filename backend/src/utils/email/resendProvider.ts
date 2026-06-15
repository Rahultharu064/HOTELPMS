import { config } from '../../config';

/** Render free/paid web services block outbound SMTP (ports 25, 465, 587). */
export const isSmtpBlockedHost = (): boolean =>
  config.isRender || config.isProduction;

export const isResendConfigured = (): boolean =>
  Boolean(config.email.resendApiKey);

export const shouldUseResend = (): boolean => {
  if (!isResendConfigured()) return false;
  if (config.email.provider === 'resend') return true;
  if (config.email.provider === 'smtp' && !isSmtpBlockedHost()) return false;
  // auto — or smtp forced on Render (SMTP blocked, Resend is the only option)
  return true;
};

export const canAttemptSmtp = (): boolean =>
  !isSmtpBlockedHost()
  && config.email.provider !== 'resend'
  && Boolean(config.email.user && config.email.pass);

export async function sendViaResend(
  to: string,
  subject: string,
  html: string
): Promise<boolean> {
  const apiKey = config.email.resendApiKey;
  if (!apiKey) return false;

  const fromAddress = config.email.from || config.email.user || 'onboarding@resend.dev';
  const from = fromAddress.includes('<')
    ? fromAddress
    : `Itahari Namuna Hotel <${fromAddress}>`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`[ResendError] ${response.status}: ${body}`);
      return false;
    }

    const data = (await response.json()) as { id?: string };
    console.log(`📧 Email sent via Resend to ${to}: ${data.id ?? 'ok'}`);
    return true;
  } catch (error) {
    console.error(`[ResendError] Failed to send to ${to}:`, error);
    return false;
  }
}

/** Lightweight startup check — Resend has no persistent SMTP connection to verify. */
export async function verifyResendConfig(): Promise<boolean> {
  if (!isResendConfigured()) return false;

  try {
    const response = await fetch('https://api.resend.com/domains', {
      headers: { Authorization: `Bearer ${config.email.resendApiKey}` },
    });
    if (response.status === 401) {
      console.error('❌ RESEND_API_KEY is invalid (401 Unauthorized).');
      return false;
    }
    return true;
  } catch (error) {
    console.error('❌ Could not reach Resend API:', error);
    return false;
  }
}
