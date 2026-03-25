import {MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex} from "typeorm";

export class createRefreshTokensTable1739120000000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "refresh_tokens",
                columns: [
                    {
                        name: "id",
                        type: "varchar",
                        isPrimary: true,
                    },
                    {
                        name: "token",
                        type: "varchar",
                        isUnique: true,
                    },
                    {
                        name: "user_id",
                        type: "varchar",
                    },
                    {
                        name: "expires_at",
                        type: "timestamp",
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "revoked_at",
                        type: "timestamp",
                        isNullable: true,
                    },
                ],
            }),
            true,
        )

        await queryRunner.createForeignKey(
            "refresh_tokens",
            new TableForeignKey({
                columnNames: ["user_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "user_entity",
                onDelete: "CASCADE",
            }),
        )

        await queryRunner.createIndex(
            "refresh_tokens",
            new TableIndex({
                name: "IDX_REFRESH_TOKENS_TOKEN",
                columnNames: ["token"],
            }),
        )

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("refresh_tokens")
        const foreignKey = table.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("user_id") !== -1,
        )
        await queryRunner.dropForeignKey("refresh_tokens", foreignKey)
        await queryRunner.dropIndex("refresh_tokens", "IDX_REFRESH_TOKENS_TOKEN")
        await queryRunner.dropTable("refresh_tokens")
    }

}
