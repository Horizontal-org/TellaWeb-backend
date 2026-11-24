import { Injectable } from '@nestjs/common';
import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
} from '@casl/ability';

import { RolesUser, UserEntity } from 'modules/user/domain';
import { ReadUserDto } from 'modules/user/dto';

export enum Actions {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type Subjects =
  InferSubjects<typeof ReadUserDto> | InferSubjects<typeof UserEntity> | 'all';

export type AppAbility = MongoAbility<[Actions, Subjects]>;

@Injectable()
export class AbilityFactory {
  createForUser(user: UserEntity) {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    switch (user.role) {
      case RolesUser.ADMIN:
        can(Actions.Manage, 'all');
        break;
      case RolesUser.REPORTER:
        // Users can update they own profile
        // but can't change role
        can(Actions.Read, UserEntity);
        can(Actions.Update, UserEntity, {
          id: { $eq: user.id },
          role: { $eq: user.role },
        });
      case RolesUser.VIEWER:
        // Manage they own profile
        can(Actions.Read, UserEntity);
        can(Actions.Update, UserEntity, {
          id: { $eq: user.id },
          role: { $eq: user.role },
        });
        break;
      case RolesUser.EDITOR:
        // Manage they own profile
        can(Actions.Read, UserEntity);
        can(Actions.Update, UserEntity, {
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
