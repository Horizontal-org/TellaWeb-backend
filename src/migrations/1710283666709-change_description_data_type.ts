import {MigrationInterface, QueryRunner} from "typeorm";

export class changeDescriptionDataType1710283666709 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            "ALTER TABLE report_entity MODIFY description TEXT NULL;"
        )    
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
