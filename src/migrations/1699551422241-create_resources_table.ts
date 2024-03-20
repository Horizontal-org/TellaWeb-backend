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
                        name: "size",
                        type: "varchar",
                        isNullable: true
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
                        name: "project_id",
                        type: "varchar",
                        isPrimary: true
                    },
                    {
                        name: "resource_id",
                        type: "varchar",
                        isPrimary: true
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
        const table = await queryRunner.getTable("projects_resources")
        const foreignKey = table.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("project_id") !== -1,
        )
        await queryRunner.dropForeignKey("projects_resources", foreignKey)

        const resourceForeignKey = table.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("resource_id") !== -1,
        )
        await queryRunner.dropForeignKey("projects_resources", resourceForeignKey)        
        await queryRunner.dropTable("projects_resources")
        await queryRunner.dropTable("resources")

    }

}
