import * as dotenv from 'dotenv';

dotenv.config({ quiet: true });

const port = parseInt(process.env.SMTP_PORT);
const debug = process.env.SMTP_DEBUG === 'true';

export const MailConfig = {
  host: process.env.SMTP_HOST,
  port,
  // 465 is implicit TLS; any other port (25, 587) upgrades with STARTTLS
  secure: port === 465,
  // refuse to send unencrypted when the server doesn't offer STARTTLS
  requireTLS: true,
  // debug logs the whole SMTP session (recipients and message bodies)
  debug,
  logger: debug,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

export default MailConfig;
