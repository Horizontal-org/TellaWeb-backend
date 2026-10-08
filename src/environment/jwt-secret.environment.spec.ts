import {
  assertJwtSecret,
  JWT_SECRET_PLACEHOLDER,
} from './jwt-secret.environment';

describe('assertJwtSecret', () => {
  const original = process.env.JWT_SECRET;
  afterEach(() => {
    process.env.JWT_SECRET = original;
  });

  it('accepts a real secret', () => {
    expect(() =>
      assertJwtSecret('k3l8Qm2vX9pT4rZ7wB1nC6yH0sD5fG2j'),
    ).not.toThrow();
  });

  it('refuses a missing or empty secret', () => {
    delete process.env.JWT_SECRET;
    expect(() => assertJwtSecret()).toThrow(/JWT_SECRET is not set/);
    for (const secret of ['', '   ']) {
      expect(() => assertJwtSecret(secret)).toThrow(/JWT_SECRET is not set/);
    }
  });

  it('refuses the placeholder committed in .env', () => {
    expect(() => assertJwtSecret(JWT_SECRET_PLACEHOLDER)).toThrow(
      /placeholder/,
    );
    expect(() => assertJwtSecret(` ${JWT_SECRET_PLACEHOLDER}\n`)).toThrow(
      /placeholder/,
    );
  });
});
