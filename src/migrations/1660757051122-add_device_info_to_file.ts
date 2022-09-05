import {
    MigrationInterface, 
    QueryRunner, 
    TableColumn
} from "typeorm";

export class addDeviceInfoToFile1660757051122 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "file_entity",
            new TableColumn({
                name: "fileInfo",
                type: "text",
                isNullable: true
            }),
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
