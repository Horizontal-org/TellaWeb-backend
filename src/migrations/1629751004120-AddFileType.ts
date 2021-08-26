import { FileType } from 'modules/file/domain/file-type.file.enum';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddFileType1629751004120 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'file_entity',
      new TableColumn({
        name: 'type',
        type: 'varchar',
        default: FileType.OTHER,
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('file', 'type');
  }
}
