import { config } from '../../config';

const RESEND_USER_AGENT = 'HOTELPMS/1.0 (https://hotelpms-three.vercel.app)';

/** Render free/paid web services block outbound SMTP (ports 25, 465, 587). */
export const isSmtpBlockedHost = (): boolean =>
  config.isRender || config.isProduction;

export const isResendConfigured = (): boolean =>
  Boolean(config.email.resendApiKey);

export const shouldUseResend = (): boolean => {
  if (!isResendConfigured()) return false;
  if (config.email.provider === 'resend') return true;
  if (config.email.provider === 'smtp' && !isSmtpBlockedHost()) return false;
  return true;
};

export const canAttemptSmtp = (): boolean =>
  !isSmtpBlockedHost()
  && config.email.provider !== 'resend'
  && Boolean(config.email.user && config.email.pass);

const isValidResendKeyFormat = (apiKey: string): boolean =>
  /^re_[A-Za-z0-9_]+$/.test(apiKey) && apiKey.length >= 20;

const resendHeaders = (apiKey: string): Record<string, string> => ({
  Authorization: `Bearer ${apiKey}`,
  'User-Agent': RESEND_USER_AGENT,
});

/** Resend sandbox sender — works without domain verification (testing only). */
const RESEND_SANDBOX_FROM = 'Itahari Namuna Hotel <onboarding@resend.dev>';

const resolveResendFrom = (): string => {
  const fromAddress = (config.email.from || '').trim();
  if (!fromAddress) return RESEND_SANDBOX_FROM;

  if (fromAddress.includes('<')) return fromAddress;

  // Gmail/Yahoo etc. cannot be used as Resend "from" until you verify that domain in Resend
  const domain = fromAddress.split('@')[1]?.toLowerCase() ?? '';
  const freeMailDomains = ['gmail.com', 'googlemail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
  if (freeMailDomains.includes(domain)) {
    return RESEND_SANDBOX_FROM;
  }

  return `Itahari Namuna Hotel <${fromAddress}>`;
};

export async function sendViaResend(
  to: string,
  subject: string,
  html: string
): Promise<boolean> {
  const apiKey = config.email.resendApiKey;
  if (!apiKey) return false;

  const from = resolveResendFrom();

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        ...resendHeaders(apiKey),
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
      if (response.status === 403 && body.includes('verify')) {
        console.error('[Resend] Tip: set SMTP_FROM=onboarding@resend.dev or verify your domain at https://resend.com/domains');
      }
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

/**
 * Startup check for Resend.
 * Sending-only API keys return 401 on /domains — that is normal and valid.
 */
export async function verifyResendConfig(): Promise<boolean> {
  const apiKey = config.email.resendApiKey;
  if (!apiKey) return false;

  if (!isValidResendKeyFormat(apiKey)) {
    console.error('❌ RESEND_API_KEY format is invalid.');
    console.error('   Keys must start with re_ and come from https://resend.com/api-keys');
    console.error('   On Render: paste the key with no quotes or spaces.');
    return false;
  }

  try {
    const response = await fetch('https://api.resend.com/domains', {
      headers: resendHeaders(apiKey),
    });

    if (response.ok) {
      return true;
    }

    const body = await response.text();

    // Sending-only keys are valid — they cannot list domains (401 restricted_api_key)
    if (
      response.status === 401 &&
      (body.includes('restricted') || body.includes('only send') || body.includes('missing_api_key') === false)
    ) {
      console.log('✅ Resend API key OK (sending permission — correct for OTP emails)');
      return true;
    }

    if (response.status === 401 && body.includes('missing_api_key')) {
      console.error('❌ RESEND_API_KEY missing in Authorization. Check Render Environment variable name.');
      return false;
    }

    if (response.status === 401) {
      // Unknown 401 — still allow if format valid (key may be new/restricted)
      console.warn('⚠️ Resend domains check returned 401 — treating sending-only key as valid.');
      console.warn(`   Detail: ${body.slice(0, 200)}`);
      return true;
    }

    if (response.status === 403) {
      console.log('✅ Resend API key accepted');
      return true;
    }

    console.warn(`⚠️ Resend probe returned ${response.status} — continuing with configured key.`);
    return true;
  } catch (error) {
    console.warn('⚠️ Could not reach Resend API at startup — emails will retry on send:', error);
    return true;
  }
}
