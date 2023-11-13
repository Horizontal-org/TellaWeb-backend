import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class createResourcesTable1699551422241 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "resources",
                columns: [
                    {
                        name: "id",
                        type: "varchar",
                        isPrimary: true,
                    },
                    {
                        name: "fileName",
                        type: "varchar",
                    },
                    {
                        name: "title",
                        type: "varchar",
                    },
                    {
                        name: "type",
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


        await queryRunner.createTable(
            new Table({
                name: "projects_resources",
                columns: [
                    {
                        name: "id",
                        type: "varchar",
                        isPrimary: true,
                    },
                    {
                        name: "project_id",
                        type: "varchar",
                    },
                    {
                        name: "resource_id",
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
            "projects_resources",
            new TableForeignKey({
                columnNames: ["project_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "project_entity",
                onDelete: "CASCADE",
            }),
        )

        await queryRunner.createForeignKey(
            "projects_resources",
            new TableForeignKey({
                columnNames: ["resource_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "resources",
                onDelete: "CASCADE",
            }),
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
