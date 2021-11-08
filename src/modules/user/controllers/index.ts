import { EditUserController } from './edit.user.controller';
import { CreateUserController } from './create.user.controller';
import { GetProfileUserController } from './get-profile.user.controller';
import { GetByUsernameController } from './get-by-username.controller';

export const userControllers = [
  CreateUserController,
  EditUserController,
  GetProfileUserController,
  GetByUsernameController,
];
