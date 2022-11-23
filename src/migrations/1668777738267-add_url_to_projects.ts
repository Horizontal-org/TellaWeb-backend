import {
    MigrationInterface, 
    QueryRunner, 
    TableColumn
} from "typeorm";

export class addUrlToProjects1668777738267 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("PRAGMA foreign_keys=OFF;");
        await queryRunner.addColumn(
            "project_entity",
            new TableColumn({
                name: "url",
                type: "varchar",
                isNullable: true
            }),
        )
        await queryRunner.query("PRAGMA foreign_keys=ON;");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
