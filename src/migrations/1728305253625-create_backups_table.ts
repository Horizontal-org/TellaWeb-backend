import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class createBackupsTable1728305253625 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "backups",
                columns: [
                    {
                        name: "id",
                        type: "varchar",
                        isPrimary: true,
                    },
                    {
                        name: "user_id",
                        type: "varchar",
                    },
                    {
                        name: "status",
                        type: "varchar",                        
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp'
                    },
                ],
            }),
            true,
        )

        await queryRunner.createForeignKey(
            "backups",
            new TableForeignKey({
                columnNames: ["user_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "user_entity",
                onDelete: "CASCADE",
            }),
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("backups")
        const foreignKey = table.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("user_id") !== -1,
        )
        await queryRunner.dropForeignKey("backups", foreignKey)
        await queryRunner.dropTable("backups")
    }

}
