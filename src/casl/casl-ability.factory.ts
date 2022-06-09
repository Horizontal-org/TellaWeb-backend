import { Injectable } from '@nestjs/common';
import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';

import { RolesUser } from 'modules/user/domain';
import { ReadUserDto } from 'modules/user/dto';

export enum Actions {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type Subjects = InferSubjects<typeof ReadUserDto> | 'all';

export type AppAbility = Ability<[Actions, Subjects]>;

@Injectable()
export class AbilityFactory {
  defineAbility(user: ReadUserDto) {
    const { can, build } = new AbilityBuilder(
      Ability as AbilityClass<AppAbility>,
    );

    switch (user.role) {
      case RolesUser.ADMIN:
        can(Actions.Manage, 'all');
        break;
      case RolesUser.REPORTER:
        // Users can update they own profile
        // but can't change role
        can(Actions.Update, ReadUserDto, {
          id: { $eq: user.id },
          role: { $eq: user.role },
        });
        break;
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
