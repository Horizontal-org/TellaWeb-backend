import { Inject } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

import { comparePassword } from 'common/utils/password.utils';

import { InvalidCredentailsUserException } from '../exceptions';
import { CredentialUserDto, ReadUserDto } from '../dto';
import {
  ICheckPasswordUserApplication,
  IFindByUsernameUserService,
  TYPES,
} from '../interfaces';

export class CheckPasswordUserApplication implements ICheckPasswordUserApplication {
  constructor(
    @Inject(TYPES.services.IFindByUsernameUserService)
    private readonly findByUsernameUserService: IFindByUsernameUserService,
  ) {}

  async execute(userCredentials: CredentialUserDto): Promise<ReadUserDto> {
    // callers pass plain objects; class-validator >= 0.14 rejects anything
    // that isn't an instance of a decorated class (forbidUnknownValues)
    const errors = await validate(
      plainToClass(CredentialUserDto, userCredentials),
    );
    if (errors.length > 0) throw new InvalidCredentailsUserException();

    const user = await this.findByUsernameUserService.execute(
      userCredentials.username,
    );
    if (!user) throw new InvalidCredentailsUserException();

    const isValid = await comparePassword(
      userCredentials.password,
      user.password,
    );

    if (!isValid) throw new InvalidCredentailsUserException();

    return plainToClass(ReadUserDto, user);
  }
}
