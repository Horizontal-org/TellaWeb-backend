import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class createAccessWhitelistTable1680017477966 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "user_whitelists",
                columns: [
                    {
                        name: "id",
                        type: "varchar",
                        isPrimary: true,
                    },
                    {
                        name: "location",
                        type: "varchar",
                    },
                    {
                        name: "user_id",
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
            "user_whitelists",
            new TableForeignKey({
                columnNames: ["user_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "user_entity",
                onDelete: "CASCADE",
            }),
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("user_whitelists")
        const foreignKey = table.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("user_id") !== -1,
        )
        await queryRunner.dropForeignKey("user_whitelists", foreignKey)
        await queryRunner.dropTable("user_whitelists")
    }

}
