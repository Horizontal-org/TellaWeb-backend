import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  ParseIntPipe,
} from '@nestjs/common';

// ParseIntPipe that also rejects negatives, which TypeORM's skip/take turn into a 500
@Injectable()
export class NonNegativeIntPipe extends ParseIntPipe {
  async transform(value: string, metadata: ArgumentMetadata): Promise<number> {
    const n = await super.transform(value, metadata);
    if (n < 0) {
      throw new BadRequestException(`${metadata.data} must not be negative`);
    }
    return n;
  }
}
