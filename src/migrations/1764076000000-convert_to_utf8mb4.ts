import { MigrationInterface, QueryRunner } from 'typeorm';

export class convertToUtf8mb41764076000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.convert(queryRunner, 'utf8mb4', 'utf8mb4_general_ci');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await this.convert(queryRunner, 'utf8', 'utf8_general_ci');
  }

  private async convert(
    queryRunner: QueryRunner,
    charset: string,
    collation: string,
  ): Promise<void> {
    const tables: { name: string }[] = await queryRunner.query(
      `SELECT TABLE_NAME AS name FROM information_schema.TABLES
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_TYPE = 'BASE TABLE'`,
    );

    await queryRunner.query(
      `ALTER DATABASE CHARACTER SET ${charset} COLLATE ${collation}`,
    );
    // FK columns on both sides change charset one table at a time
    await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0');
    try {
      for (const { name } of tables) {
        await queryRunner.query(
          `ALTER TABLE \`${name}\` CONVERT TO CHARACTER SET ${charset} COLLATE ${collation}`,
        );
      }
    } finally {
      await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1');
    }
  }
}
