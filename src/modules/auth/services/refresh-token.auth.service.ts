import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, IsNull, Not } from 'typeorm';
import { randomBytes } from 'crypto';
import { RefreshTokenEntity } from '../domain/refresh-token.entity';
import { IRefreshTokenAuthService } from '../interfaces/services/refresh-token.auth.service.interface';

@Injectable()
export class RefreshTokenAuthService implements IRefreshTokenAuthService {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepo: Repository<RefreshTokenEntity>,
  ) {}

  async generate(userId: string): Promise<string> {
    await this.revokeAllForUser(userId);

    const token = randomBytes(40).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    const refreshToken = this.refreshTokenRepo.create({
      token,
      userId,
      expiresAt,
    });

    await this.refreshTokenRepo.save(refreshToken);
    return token;
  }

  async validate(token: string): Promise<{ userId: string }> {
    const record = await this.refreshTokenRepo.findOne({
      where: { token },
    });

    if (!record) {
      return null;
    }

    if (record.revokedAt || record.expiresAt < new Date()) {
      return null;
    }

    return { userId: record.userId };
  }

  async revoke(token: string): Promise<void> {
    await this.refreshTokenRepo.update(
      { token },
      { revokedAt: new Date() },
    );
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.refreshTokenRepo.update(
      { userId, revokedAt: IsNull() },
      { revokedAt: new Date() },
    );
  }

  async cleanup(): Promise<void> {
    const now = new Date();
    const oneDayAgo = new Date(Date.now() - 1000 * 60 * 60 * 24);

    await this.refreshTokenRepo
      .createQueryBuilder()
      .delete()
      .where('expires_at < :now', { now })
      .orWhere('revoked_at IS NOT NULL AND revoked_at < :oneDayAgo', { oneDayAgo })
      .execute();
  }
}
