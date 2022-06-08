import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { ForbiddenError } from '@casl/ability';

import { AppAbility } from './casl-ability.factory';

@Catch(ForbiddenError)
export class AbilityExceptionFilter implements ExceptionFilter {
  catch(exception: ForbiddenError<AppAbility>, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = 401;

    response.status(status).json({
      statusCode: status,
      error: 'Unauthorized',
      message: exception.message,
    });
  }
}
