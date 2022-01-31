import { EditUserController } from './edit.user.controller';
import { CreateUserController } from './create.user.controller';
import { GetProfileUserController } from './get-profile.user.controller';
import { GetByUsernameController } from './get-by-username.controller';
import { ChangePasswordUserController } from './change-password.user.controller';
import { ListUserController } from './list.user.controllers';

export const userControllers = [
  ListUserController,
  ChangePasswordUserController,
  CreateUserController,
  EditUserController,
  GetProfileUserController,
  GetByUsernameController,
];
