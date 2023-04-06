// import * as dotenv from 'dotenv';

// dotenv.config();

export const MailConfig = {
  host: "email.wearehorizontal.org",
  port: 25,
  secure: false,
  debug: true,
  logger: true,
  direct:true,
  auth: {
    user: "horizontal/tellaweb-beta",
    pass: "J96Mjt4q6Bw22risL6SHOcEQ",
  }
}

export default MailConfig