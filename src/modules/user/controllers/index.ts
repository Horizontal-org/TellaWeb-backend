import { EditUserController } from './edit.user.controller';
import { CreateUserController } from './create.user.controller';
import { GetProfileUserController } from './get-profile.user.controller';
import { GetByUsernameController } from './get-by-username.controller';
import { ChangePasswordUserController } from './change-password.user.controller';
import { ListUserController } from './list.user.controllers';
import { DeleteByIdUserController } from './delete-by-id.user.controller';
import { BatchDeleteUsersController } from './batch-delete.user.controller';
import { ConfirmPasswordUserController } from './confirm-password.user.controller';
import { UnblockUserController } from './unblock.user.controller';

export const userControllers = [
  ListUserController,
  ChangePasswordUserController,
  CreateUserController,
  BatchDeleteUsersController,
  EditUserController,
  GetProfileUserController,
  DeleteByIdUserController,
  ConfirmPasswordUserController,
  UnblockUserController,
  // this needs to be last always
  GetByUsernameController,
];
