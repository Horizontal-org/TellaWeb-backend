import { MethodNotAllowedException } from '@nestjs/common';

export class AdminCantBePublicUserException extends MethodNotAllowedException {}
