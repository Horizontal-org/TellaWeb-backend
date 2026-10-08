import * as dotenv from 'dotenv';
dotenv.config({ quiet: true });

export const BCRYPT_SALT: number = +process.env.BCRYPT_SALT || 10;
