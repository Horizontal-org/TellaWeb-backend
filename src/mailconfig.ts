import * as dotenv from 'dotenv';

dotenv.config({ quiet: true });

export const MailConfig = {
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false,
  debug: true,
  logger: true,
  direct: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

export default MailConfig;
