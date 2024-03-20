import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class addBackupCodes1676295857214 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("user_entity", "backup_key")
        
        await queryRunner.createTable(
            new Table({
                name: "recovery_keys",
                columns: [
                    {
                        name: "id",
                        type: "varchar",
                        isPrimary: true,
                    },
                    {
                        name: "code",
                        type: "varchar",
                    },
                    {
                        name: "user_id",
                        type: "varchar",
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp'

                    }
                ],
            }),
            true,
        )


        await queryRunner.createForeignKey(
            "recovery_keys",
            new TableForeignKey({
                columnNames: ["user_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "user_entity",
                onDelete: "CASCADE",
            }),
        )


    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("recovery_keys")
        const foreignKey = table.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("user_id") !== -1,
        )
        await queryRunner.dropForeignKey("recovery_keys", foreignKey)
        await queryRunner.dropTable("recovery_keys")
    }

}
