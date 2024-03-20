import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from "typeorm";

export class addUserVerificationsTable1679496025640 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "user_entity",
            new TableColumn({
                name: "blocked",
                type: "boolean",
                isNullable: false,
                default: false
            }),
        )

        await queryRunner.createTable(
            new Table({
                name: "user_verification_codes",
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
                    },
                    {
                        name: 'expires_at',
                        type: 'timestamp',
                        isNullable: true                        
                    }
                ],
            }),
            true,
        )


        await queryRunner.createForeignKey(
            "user_verification_codes",
            new TableForeignKey({
                columnNames: ["user_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "user_entity",
                onDelete: "CASCADE",
            }),
        )

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("user_verification_codes")
        const foreignKey = table.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("user_id") !== -1,
        )
        await queryRunner.dropForeignKey("user_verification_codes", foreignKey)
        await queryRunner.dropTable("user_verification_codes")

        await queryRunner.dropColumn(
            "user_entity",
            'blocked'
        )
    }

}
