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
  const { address } = await dns.promises.lookup(hostname, { family: 4 });
  return address;
};

const createTransporterForPort = async (
  hostname: string,
  port: number
): Promise<SmtpTransportResult> => {
  const { user, pass } = config.email;
  if (!user || !pass) {
    throw new Error('SMTP_USER and SMTP_PASS are required');
  }

  const connectHost = await resolveIpv4(hostname);

  const transporter = nodemailer.createTransport({
    host: connectHost,
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: {
      minVersion: 'TLSv1.2',
      servername: hostname,
    },
    family: 4,
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 20000,
  } as nodemailer.TransportOptions);

  return { transporter, hostname, connectHost, port };
};

/**
 * Try configured port, then 465 (SSL), then 587 (STARTTLS).
 * Connects via resolved IPv4 address with TLS SNI on the original hostname.
 */
export const createVerifiedSmtpTransporter = async (): Promise<SmtpTransportResult> => {
  const hostname = resolveSmtpHostname();
  const ports = [...new Set([config.email.port || 587, 465, 587])];
  let lastError: unknown;

  for (const port of ports) {
    try {
      const result = await createTransporterForPort(hostname, port);
      await result.transporter.verify();
      return result;
    } catch (error) {
      lastError = error;
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[Email] SMTP ${hostname}:${port} failed — ${message}`);
    }
  }

  throw lastError ?? new Error('SMTP connection failed on all ports');
};
