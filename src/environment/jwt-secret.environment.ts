import * as dotenv from 'dotenv';
dotenv.config({ quiet: true });

// the value committed in .env, which ends up in the Docker image
export const JWT_SECRET_PLACEHOLDER = 'change_this_to_secure_your_backend';

// Tokens are signed with JWT_SECRET. Without one set in the environment the
// server would sign them with the placeholder from the repository, so anyone
// could forge an admin token. Refuse to start instead.
export function assertJwtSecret(secret = process.env.JWT_SECRET): void {
  if (!secret || !secret.trim()) {
    throw new Error(
      'JWT_SECRET is not set. Set a long random value in the environment.',
    );
  }
  if (secret.trim() === JWT_SECRET_PLACEHOLDER) {
    throw new Error(
      'JWT_SECRET is still the placeholder from .env. Set a long random value in the environment.',
    );
  }
}
