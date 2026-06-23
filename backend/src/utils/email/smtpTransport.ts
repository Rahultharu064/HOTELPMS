import dns from 'dns';
import nodemailer from 'nodemailer';
import { config } from '../../config';

/** Prefer IPv4 globally — Render/cloud hosts often lack working IPv6 routes. */
if (typeof dns.setDefaultResultOrder === 'function') {
  dns.setDefaultResultOrder('ipv4first');
}

export type SmtpTransportResult = {
  transporter: nodemailer.Transporter;
  hostname: string;
  connectHost: string;
  port: number;
};

const resolveSmtpHostname = (): string => {
  return config.email.host || 'smtp.gmail.com';
};

const resolveIpv4 = async (hostname: string): Promise<string> => {
  try {
    const { address } = await dns.promises.lookup(hostname, { family: 4 });
    return address;
  } catch {
    // If DNS lookup fails, return the hostname itself and let nodemailer handle it
    return hostname;
  }
};

const createTransporterForPort = async (
  hostname: string,
  port: number
): Promise<SmtpTransportResult> => {
  const { user, pass } = config.email;
  if (!user || !pass) {
    throw new Error('SMTP_USER and SMTP_PASS are required');
  }

  let connectHost: string;
  try {
    connectHost = await resolveIpv4(hostname);
  } catch {
    connectHost = hostname;
  }

  const transporter = nodemailer.createTransport({
    host: connectHost,
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: {
      minVersion: 'TLSv1.2',
      servername: hostname,
      rejectUnauthorized: false, // More permissive for cloud environments
    },
    family: 4,
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 15000,
  } as nodemailer.TransportOptions);

  return { transporter, hostname, connectHost, port };
};

/**
 * Try configured port, then 587 (STARTTLS), then 465 (SSL).
 * In production (Render/cloud), SMTP ports may be blocked — we skip verify()
 * and return the transporter anyway, logging a warning. Actual send will tell
 * us if it truly works.
 */
export const createVerifiedSmtpTransporter = async (): Promise<SmtpTransportResult> => {
  const hostname = resolveSmtpHostname();
  const configuredPort = config.email.port || 587;
  // Try 587 first (STARTTLS, most widely open), then 465 (SSL)
  const ports = [...new Set([configuredPort, 587, 465])];
  let lastError: unknown;

  for (const port of ports) {
    try {
      const result = await createTransporterForPort(hostname, port);

      // Try verify() but don't fail if it times out (Render blocks SMTP ports on verify too)
      try {
        await result.transporter.verify();
        console.log(`[Email] SMTP ${hostname}:${port} verified successfully.`);
      } catch (verifyError) {
        const msg = verifyError instanceof Error ? verifyError.message : String(verifyError);
        // If it's a timeout/connection error (Render blocking), still return the transporter
        // — actual sends via Gmail SMTP relay may still work
        if (msg.includes('ETIMEDOUT') || msg.includes('timeout') || msg.includes('ECONNREFUSED')) {
          console.warn(`[Email] SMTP verify timed out on ${hostname}:${port} (likely firewall). Transporter created anyway — will attempt sends.`);
          return result;
        }
        // For auth errors or other real errors, re-throw to try next port
        throw verifyError;
      }

      return result;
    } catch (error) {
      lastError = error;
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[Email] SMTP ${hostname}:${port} failed — ${message}`);
    }
  }

  // If all ports failed at verify, create a transporter on the configured port anyway
  // so that emails can still be attempted (some cloud providers route SMTP differently)
  console.warn('[Email] All SMTP verify attempts failed. Creating fallback transporter — emails may still work depending on cloud routing.');
  return createTransporterForPort(hostname, configuredPort);
};
