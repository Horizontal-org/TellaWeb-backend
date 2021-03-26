import {
  ArgumentMetadata,
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
  ValidationError,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (!value) throw new BadRequestException('No data submitted');

    const { metatype } = metadata;

    if (!metatype || !this.toValidate(metatype)) return value;

    const newObject = plainToClass(metatype, value);
    const errors = await validate(newObject, {
      whitelist: true,
      supressUnknownValues: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0)
      throw new HttpException(
        { message: 'Invalid Payload', errors: this.buildError(errors) },
        HttpStatus.BAD_REQUEST,
      );

    return value;
  }

  private buildError(errors: ValidationError[]) {
    const result = {};
    errors.forEach((el) => {
      const prop = el.property;
      Object.entries(el.constraints).forEach((constraint) => {
        result[prop + constraint[0]] = `${constraint[1]}`;
      });
    });
    return result;
  }

  private toValidate(metatype: unknown): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find((type) => metatype === type);
  }
}
