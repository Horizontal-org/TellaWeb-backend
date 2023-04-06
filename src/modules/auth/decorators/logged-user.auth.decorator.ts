import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JWTPayload } from 'modules/jwt/domain/jwt-payload.auth.ov';


export const LoggedUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): Partial<JWTPayload> => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
