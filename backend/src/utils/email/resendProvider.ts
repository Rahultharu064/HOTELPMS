import { config } from '../../config';

export const isResendConfigured = (): boolean =>
  Boolean(config.email.resendApiKey);

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
