import { RolesUser, UserEntity } from 'modules/user/domain';
import { AbilityFactory, Actions } from './casl-ability.factory';

function user(id: string, role: RolesUser): UserEntity {
  const entity = new UserEntity();
  entity.id = id;
  entity.role = role;
  return entity;
}

describe('AbilityFactory', () => {
  const factory = new AbilityFactory();

  it('lets admins manage everything', () => {
    const ability = factory.createForUser(user('a', RolesUser.ADMIN));
    expect(ability.can(Actions.Manage, 'all')).toBe(true);
    expect(ability.can(Actions.Delete, user('b', RolesUser.EDITOR))).toBe(true);
  });

  for (const role of [RolesUser.EDITOR, RolesUser.VIEWER, RolesUser.REPORTER]) {
    describe(role, () => {
      const self = user('self', role);
      const ability = factory.createForUser(self);

      it('can read users', () => {
        expect(ability.can(Actions.Read, user('other', RolesUser.ADMIN))).toBe(
          true,
        );
      });

      it('can update itself, keeping its role', () => {
        expect(ability.can(Actions.Update, self)).toBe(true);
        const promoted = user('self', RolesUser.ADMIN);
        expect(ability.can(Actions.Update, promoted)).toBe(false);
      });

      it('cannot update other users or delete anyone', () => {
        expect(ability.can(Actions.Update, user('other', role))).toBe(false);
        expect(ability.can(Actions.Delete, self)).toBe(false);
        expect(ability.can(Actions.Manage, 'all')).toBe(false);
      });
    });
  }
});
