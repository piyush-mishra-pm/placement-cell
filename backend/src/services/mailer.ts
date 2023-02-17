import { createTransport } from 'nodemailer';

// Can optionally use Sendgrid here. Currently only using MailHog.

// MailHog transporter
export const mailTransporter = createTransport({ host: '0.0.0.0', port: 1025 });

