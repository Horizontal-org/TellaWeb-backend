import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeRoles1654669310400 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE user_entity SET role = 'admin' WHERE role = '0'`,
    );
    await queryRunner.query(
      `UPDATE user_entity SET role = 'reporter' WHERE role = '1'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE user_entity SET role = '0' WHERE role = 'admin'`,
    );
    await queryRunner.query(
      `UPDATE user_entity SET role = '1' WHERE role = 'reporter'`,
    );
  }
}
